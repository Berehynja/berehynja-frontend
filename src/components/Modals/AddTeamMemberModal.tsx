import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Cropper, { type Area } from "react-easy-crop";
import {
  AlertTriangle,
  Award,
  Briefcase,
  Camera,
  Check,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Plus,
  Trash2,
  User,
  Wrench,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { uploadMedia } from "../../services/cloudinaryService";
import { getCroppedImg } from "../../utils/getCroppedImg";
import type { TeamMember } from "../../types/teamMember";
import type { LangKey } from "../../types/types";

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TeamMember) => void | Promise<void>;
  memberToEdit?: TeamMember | null;
  onDelete?: (memberId: string) => void | Promise<void>;
}

const LANGUAGES: Array<{ key: LangKey; label: string }> = [
  { key: "ua", label: "UA" },
  { key: "de", label: "DE" },
  { key: "en", label: "EN" },
];

const MAX_FILE_SIZE = 12 * 1024 * 1024;

const emptyMember = (): TeamMember => ({
  name: { ua: "", de: "", en: "" },
  role: { ua: "", de: "", en: "" },
  description: { ua: "", de: "", en: "" },
  skills: { ua: [], de: [], en: [] },
  education: { ua: "", de: "", en: "" },
  image: "",
});

const copyMember = (member?: TeamMember | null): TeamMember => {
  if (!member) return emptyMember();

  return {
    ...member,
    name: { ...member.name },
    role: { ...member.role },
    description: { ...member.description },
    education: { ...member.education },
    skills: {
      ua: [...(member.skills.ua ?? [])],
      de: [...(member.skills.de ?? [])],
      en: [...(member.skills.en ?? [])],
    },
    image: member.image ?? "",
  };
};

export const AddTeamMemberModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  memberToEdit,
}: AddTeamMemberModalProps) => {
  const { t } = useTranslation();
  const tr = (key: string) => t(`admin.teamMemberModal.${key}`);
  const modalTitleId = useId();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);


  const [activeLang, setActiveLang] = useState<LangKey>("ua");
  const [formData, setFormData] = useState<TeamMember>(() =>
    copyMember(memberToEdit),
  );
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isBusy = isUploading || isSaving || isDeleting;

  const closeCropper = useCallback(() => {
    setSelectedFileUrl(null);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  const handleClose = useCallback(() => {
    if (isBusy) return;
    closeCropper();
    setIsDeleteModalOpen(false);
    onClose();
  }, [closeCropper, isBusy, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    setFormData(copyMember(memberToEdit));
    setActiveLang("ua");
    setIsDeleteModalOpen(false);
    closeCropper();
  }, [closeCropper, isOpen, memberToEdit]);

  useEffect(() => {
    if (!selectedFileUrl) return;
    return () => URL.revokeObjectURL(selectedFileUrl);
  }, [selectedFileUrl]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || isBusy) return;

      if (selectedFileUrl) {
        closeCropper();
      } else if (isDeleteModalOpen) {
        setIsDeleteModalOpen(false);
      } else {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [
    closeCropper,
    isBusy,
    isDeleteModalOpen,
    isOpen,
    onClose,
    selectedFileUrl,
  ]);

  const handleTextChange = (
    field: "name" | "role" | "description" | "education",
    value: string,
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: { ...previous[field], [activeLang]: value },
    }));
  };

  const addSkill = () => {
    if (formData.skills[activeLang].length >= 6) return;

    setFormData((previous) => ({
      ...previous,
      skills: {
        ...previous.skills,
        [activeLang]: [...previous.skills[activeLang], ""],
      },
    }));
  };

  const updateSkill = (index: number, value: string) => {
    setFormData((previous) => ({
      ...previous,
      skills: {
        ...previous.skills,
        [activeLang]: previous.skills[activeLang].map((skill, skillIndex) =>
          skillIndex === index ? value : skill,
        ),
      },
    }));
  };

  const removeSkill = (index: number) => {
    setFormData((previous) => ({
      ...previous,
      skills: {
        ...previous.skills,
        [activeLang]: previous.skills[activeLang].filter(
          (_, skillIndex) => skillIndex !== index,
        ),
      },
    }));
  };

  const handlePhotoSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(tr("invalidImage"));
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(tr("imageTooLarge"));
      event.target.value = "";
      return;
    }

    setSelectedFileUrl(URL.createObjectURL(file));
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    event.target.value = "";
  };

  const handleCropSave = async () => {
    if (!selectedFileUrl || !croppedAreaPixels || isUploading) return;

    setIsUploading(true);

    try {
      const croppedBlob = await getCroppedImg(
        selectedFileUrl,
        croppedAreaPixels,
      );
      const croppedFile = new File([croppedBlob], "team-member.jpg", {
        type: "image/jpeg",
      });
      const folderName =
        formData.name.ua.trim() || formData.name[activeLang].trim() || "member";
      const result = await uploadMedia(croppedFile, "team", folderName);

      setFormData((previous) => ({ ...previous, image: result.url }));
      closeCropper();
      toast.success(tr("uploadSuccess"));
    } catch (error) {
      console.error("Team photo crop or upload error:", error);
      toast.error(tr("uploadError"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy) return;

    if (!formData.name.ua.trim() || !formData.role.ua.trim()) {
      setActiveLang("ua");
      toast.error(tr("validation"));
      return;
    }

    const cleanedMember: TeamMember = {
      ...formData,
      name: {
        ua: formData.name.ua.trim(),
        de: formData.name.de.trim(),
        en: formData.name.en.trim(),
      },
      role: {
        ua: formData.role.ua.trim(),
        de: formData.role.de.trim(),
        en: formData.role.en.trim(),
      },
      education: {
        ua: formData.education.ua.trim(),
        de: formData.education.de.trim(),
        en: formData.education.en.trim(),
      },
      description: {
        ua: formData.description.ua.trim(),
        de: formData.description.de.trim(),
        en: formData.description.en.trim(),
      },
      skills: {
        ua: formData.skills.ua.map((skill) => skill.trim()).filter(Boolean),
        de: formData.skills.de.map((skill) => skill.trim()).filter(Boolean),
        en: formData.skills.en.map((skill) => skill.trim()).filter(Boolean),
      },
    };

    setIsSaving(true);

    try {
      await onSave(cleanedMember);
      toast.success(tr("saved"));
      onClose();
    } catch (error) {
      console.error("Team member save error:", error);
      toast.error(tr("saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!memberToEdit?.id || !onDelete || isBusy) return;

    setIsDeleting(true);

    try {
      await onDelete(memberToEdit.id);
      toast.success(tr("deleted"));
      setIsDeleteModalOpen(false);
      onClose();
    } catch (error) {
      console.error("Team member delete error:", error);
      toast.error(tr("deleteError"));
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  const currentSkills = formData.skills[activeLang] ?? [];
  const canAddSkill = currentSkills.length < 6;

  return (
    <div className="font-nunito fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-6">
      <button
        type="button"
        aria-label={tr("close")}
        onClick={handleClose}
        className="absolute inset-0 cursor-default bg-slate-950/65 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitleId}
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_32px_90px_rgba(15,23,42,0.35)]"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 bg-linear-to-br from-blue-600 to-blue-900 px-5 py-5 text-white md:px-8 md:py-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-yellow-300 shadow-inner backdrop-blur-md">
              <User size={25} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold tracking-[0.18em] text-blue-100 uppercase">
                {tr("admin")}
              </p>
              <h2
                id={modalTitleId}
                className="truncate text-xl font-semibold tracking-tight text-white md:text-2xl"
              >
                {memberToEdit ? tr("editTitle") : tr("createTitle")}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isBusy}
            aria-label={tr("close")}
            title={tr("close")}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-white/15 bg-black/10 text-white shadow-sm backdrop-blur-md transition hover:bg-black/20 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X size={21} aria-hidden="true" />
          </button>
        </header>

        <form
          id="team-member-form"
          onSubmit={handleSubmit}
          className="overflow-y-auto bg-slate-50/60 px-5 py-6 md:px-8 md:py-7"
        >
          <div className="space-y-7">
            <div className="grid gap-6 border-b border-slate-200 pb-7 md:grid-cols-[220px_1fr] md:items-start">
              <section>
                <h3 className="mb-3 text-sm font-semibold text-slate-800">
                  {tr("photo")}
                </h3>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                  <div className="aspect-square overflow-hidden">
                    {formData.image && formData.image !== "placeholder" ? (
                      <img
                        src={formData.image}
                        alt=""
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
                        {formData.image === "placeholder" ? (
                          <User size={62} strokeWidth={1.25} />
                        ) : (
                          <Camera size={34} strokeWidth={1.5} />
                        )}
                        <span className="text-xs font-bold">{tr("photo")}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2 border-t border-slate-200 bg-white p-3">
                    <input
                      ref={fileInputRef}
                      id={fileInputId}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="sr-only"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isBusy}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Camera size={16} />
                      {formData.image ? tr("changePhoto") : tr("choosePhoto")}
                    </button>

                    {formData.image ? (
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((previous) => ({
                            ...previous,
                            image: "",
                          }))
                        }
                        disabled={isBusy}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                        {tr("removePhoto")}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((previous) => ({
                            ...previous,
                            image: "placeholder",
                          }))
                        }
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                      >
                        <User size={16} />
                        {tr("usePlaceholder")}
                      </button>
                    )}
                  </div>
                </div>
              </section>

              <section aria-labelledby={`${modalTitleId}-language`}>
                <p
                  id={`${modalTitleId}-language`}
                  className="mb-3 text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase"
                >
                  {tr("language")}
                </p>

                <div
                  role="tablist"
                  aria-label={tr("language")}
                  className="grid grid-cols-3 gap-1 rounded-2xl bg-slate-100 p-1.5"
                >
                  {LANGUAGES.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={activeLang === key}
                      onClick={() => setActiveLang(key)}
                      className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                        activeLang === key
                          ? "bg-white text-blue-700 shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {label}
                      {formData.name[key].trim() &&
                        formData.role[key].trim() && (
                          <CheckCircle2
                            size={14}
                            className="text-emerald-500"
                          />
                        )}
                    </button>
                  ))}
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <User size={17} className="text-blue-600" />
                      {tr("name")} ({activeLang.toUpperCase()})
                      {activeLang === "ua" && (
                        <span className="text-xs text-blue-600">
                          {tr("required")}
                        </span>
                      )}
                    </span>
                    <input
                      type="text"
                      value={formData.name[activeLang]}
                      onChange={(event) =>
                        handleTextChange("name", event.target.value)
                      }
                      placeholder={tr("namePlaceholder")}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <Briefcase size={17} className="text-blue-600" />
                      {tr("role")} ({activeLang.toUpperCase()})
                      {activeLang === "ua" && (
                        <span className="text-xs text-blue-600">
                          {tr("required")}
                        </span>
                      )}
                    </span>
                    <input
                      type="text"
                      value={formData.role[activeLang]}
                      onChange={(event) =>
                        handleTextChange("role", event.target.value)
                      }
                      placeholder={tr("rolePlaceholder")}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>
                </div>
              </section>
            </div>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <GraduationCap size={18} className="text-blue-600" />
                {tr("education")} ({activeLang.toUpperCase()})
              </span>
              <input
                type="text"
                value={formData.education[activeLang]}
                onChange={(event) =>
                  handleTextChange("education", event.target.value)
                }
                placeholder={tr("educationPlaceholder")}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </label>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-4 md:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Wrench size={17} className="text-blue-600" />
                    {tr("skills")} ({activeLang.toUpperCase()})
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {tr("skillLimit")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addSkill}
                  disabled={!canAddSkill}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                >
                  <Plus size={15} />
                  {tr("addSkill")}
                </button>
              </div>

              {currentSkills.length > 0 && (
                <div className="grid gap-3 md:grid-cols-2">
                  {currentSkills.map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(event) =>
                          updateSkill(index, event.target.value)
                        }
                        placeholder={tr("skillPlaceholder")}
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        aria-label={tr("removeSkill")}
                        title={tr("removeSkill")}
                        className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Award size={18} className="text-amber-500" />
                {tr("description")} ({activeLang.toUpperCase()})
              </span>
              <textarea
                rows={4}
                value={formData.description[activeLang]}
                onChange={(event) =>
                  handleTextChange("description", event.target.value)
                }
                placeholder={tr("descriptionPlaceholder")}
                className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </label>
          </div>
        </form>

        <footer className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            {memberToEdit?.id && onDelete && (
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={isBusy}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
              >
                <Trash2 size={18} />
                {tr("delete")}
              </button>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 md:flex-row">
            <button
              type="button"
              onClick={handleClose}
              disabled={isBusy}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {tr("cancel")}
            </button>
            <button
              type="submit"
              form="team-member-form"
              disabled={isBusy}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
            >
              {isSaving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Check size={18} />
              )}
              {isSaving ? tr("saving") : memberToEdit ? tr("save") : tr("create")}
            </button>
          </div>
        </footer>
      </div>

      {selectedFileUrl && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${modalTitleId}-crop-title`}
            className="flex max-h-[calc(100dvh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-4xl border border-white/70 bg-white shadow-2xl"
          >
            <header className="flex items-center justify-between gap-4 bg-linear-to-br from-blue-600 to-blue-900 px-5 py-5 text-white md:px-6">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-yellow-300 shadow-inner backdrop-blur-md">
                  <Camera size={22} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3
                    id={`${modalTitleId}-crop-title`}
                    className="text-lg font-semibold text-white"
                  >
                    {tr("cropTitle")}
                  </h3>
                  <p className="mt-1 text-sm text-blue-100">{tr("cropHint")}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeCropper}
                disabled={isUploading}
                aria-label={tr("close")}
                title={tr("close")}
                className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-black/10 text-white backdrop-blur-md transition hover:bg-black/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={19} aria-hidden="true" />
              </button>
            </header>

            <div className="relative h-[min(60dvh,32rem)] w-full bg-slate-950">
              <Cropper
                image={selectedFileUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedPixels) =>
                  setCroppedAreaPixels(croppedPixels)
                }
              />
            </div>

            <div className="space-y-4 px-5 py-4 md:px-6">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold tracking-wide text-slate-600 uppercase">
                  {tr("zoom")}
                </span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(event) => setZoom(Number(event.target.value))}
                  className="w-full cursor-pointer accent-blue-600"
                />
              </label>

              <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end">
                <button
                  type="button"
                  onClick={closeCropper}
                  disabled={isUploading}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {tr("cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleCropSave}
                  disabled={isUploading || !croppedAreaPixels}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isUploading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Check size={18} />
                  )}
                  {isUploading ? tr("uploading") : tr("apply")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`${modalTitleId}-delete-title`}
            className="w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl"
          >
            <div className="flex items-start gap-4 p-6">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <AlertTriangle size={23} />
              </span>
              <div>
                <h3
                  id={`${modalTitleId}-delete-title`}
                  className="text-lg font-semibold text-slate-950"
                >
                  {tr("deleteTitle")}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {tr("deleteMessage")}
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 p-4 md:flex-row md:justify-end">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {tr("cancel")}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
              >
                {isDeleting && <Loader2 size={17} className="animate-spin" />}
                {isDeleting ? tr("deleting") : tr("confirmDelete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
