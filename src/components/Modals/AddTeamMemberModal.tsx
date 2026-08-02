import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import {
  Award,
  Briefcase,
  Camera,
  CheckCircle2,
  GraduationCap,
  Plus,
  Trash2,
  User,
  Wrench,
  X,
} from "lucide-react";

import { uploadMedia } from "../../services/cloudinaryService";
import { getCroppedImg } from "../../utils/getCroppedImg";

import type { TeamMember } from "../../types/teamMember";
import type { LangKey } from "../../types/types";

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TeamMember) => void;
  memberToEdit?: TeamMember | null;
  onDelete?: (memberId: string) => void;
}

export const AddTeamMemberModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  memberToEdit,
}: AddTeamMemberModalProps) => {
  const [activeLang, setActiveLang] = useState<LangKey>("ua");
  const [isUploading, setIsUploading] = useState(false);

  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const getEmptyFormState = (): TeamMember => ({
    name: { ua: "", en: "", de: "" },
    role: { ua: "", en: "", de: "" },
    description: { ua: "", en: "", de: "" },
    skills: { ua: [], en: [], de: [] },
    education: { ua: "", en: "", de: "" },
    image: "",
  });

  const [formData, setFormData] = useState<TeamMember>(getEmptyFormState());

  useEffect(() => {
    if (isOpen) {
      if (memberToEdit) {
        setFormData({ ...memberToEdit });
      } else {
        setFormData(getEmptyFormState());
      }
    }
  }, [memberToEdit, isOpen]);

  const handleTextChange = (
    field: keyof Omit<TeamMember, "id" | "skills" | "image">,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [activeLang]: value },
    }));
  };

  const addSkill = () => {
    if (formData.skills[activeLang].length >= 6) return;

    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [activeLang]: [...(prev.skills[activeLang] || []), ""],
      },
    }));
  };

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...formData.skills[activeLang]];
    newSkills[index] = value;

    setFormData((prev) => ({
      ...prev,
      skills: { ...prev.skills, [activeLang]: newSkills },
    }));
  };

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [activeLang]: prev.skills[activeLang].filter((_, i) => i !== index),
      },
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setSelectedFileUrl(imageUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);

    e.target.value = "";
  };

  const handleCropCancel = () => {
    if (selectedFileUrl) {
      URL.revokeObjectURL(selectedFileUrl);
    }

    setSelectedFileUrl(null);
    setCroppedAreaPixels(null);
  };

  const handleCropSave = async () => {
    if (!selectedFileUrl || !croppedAreaPixels) return;

    setIsUploading(true);

    try {
      const croppedBlob = await getCroppedImg(
        selectedFileUrl,
        croppedAreaPixels,
      );

      const croppedFile = new File([croppedBlob], "team-member.jpg", {
        type: "image/jpeg",
      });

      const result = await uploadMedia(
        croppedFile,
        "team",
        formData.name[activeLang]?.trim() || "member",
      );

      setFormData((prev) => ({ ...prev, image: result.url }));

      URL.revokeObjectURL(selectedFileUrl);
      setSelectedFileUrl(null);
      setCroppedAreaPixels(null);
    } catch (error) {
      console.error("Crop upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  const renderImagePreview = () => {
    if (formData.image === "placeholder") {
      return (
        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
          <User size={64} className="opacity-50" />
        </div>
      );
    }

    if (formData.image) {
      return (
        <img
          src={formData.image}
          className="h-full w-full object-cover object-center"
          alt="Попередній перегляд фото"
        />
      );
    }

    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center text-slate-400">
        <Camera size={20} />
        <span className="text-[9px] font-bold uppercase">Фото</span>
      </div>
    );
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="animate-in zoom-in-95 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-5">
            <h2 className="text-xl font-bold tracking-tight text-slate-800 uppercase">
              {memberToEdit ? "Редагування профілю" : "Новий фахівець"}
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-200"
              aria-label="Закрити модальне вікно"
            >
              <X size={20} />
            </button>
          </header>

          <form
            onSubmit={handleSubmit}
            className="custom-scrollbar space-y-6 overflow-y-auto p-6 sm:p-8"
          >
            <div className="flex flex-col items-center gap-6 border-b border-slate-50 pb-6 md:flex-row md:items-start">
              <div className="flex shrink-0 items-center gap-3 md:items-start">
                <div className="group relative size-32 overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-100">
                  {renderImagePreview()}

                  <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-slate-900/40 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                    <Plus className="text-white" size={24} />
                    <span className="sr-only">Обрати фотографію</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="sr-only"
                    />
                  </label>
                </div>

                <div className="flex flex-col justify-center gap-2">
                  {formData.image ? (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="flex size-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-colors hover:bg-red-100"
                      title="Видалити фотографію або заглушку"
                    >
                      <Trash2 size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          image: "placeholder",
                        }))
                      }
                      className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50"
                      title="Встановити універсальну заглушку"
                    >
                      <User size={20} />
                    </button>
                  )}
                </div>
              </div>

              <div className="w-full flex-1 space-y-3">
                <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Мова заповнення:
                </label>

                <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
                  {(["ua", "de", "en"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveLang(lang)}
                      className={`flex-1 rounded-lg py-2 text-xs font-bold uppercase transition-all ${
                        activeLang === lang
                          ? "bg-white text-blue-600 shadow"
                          : "text-slate-500"
                      }`}
                    >
                      {lang}
                      {formData.name[lang] && (
                        <CheckCircle2
                          size={10}
                          className="ml-1 inline text-green-500"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                  <User size={12} className="text-blue-500" />
                  Імʼя ({activeLang})
                </label>

                <input
                  required
                  value={formData.name[activeLang]}
                  onChange={(e) => handleTextChange("name", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                  <Briefcase size={12} className="text-blue-500" />
                  Посада ({activeLang})
                </label>

                <input
                  required
                  value={formData.role[activeLang]}
                  onChange={(e) => handleTextChange("role", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                <GraduationCap size={14} className="text-blue-500" />
                Освіта ({activeLang})
              </label>

              <input
                value={formData.education[activeLang]}
                onChange={(e) =>
                  handleTextChange("education", e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                  <Wrench size={12} className="text-blue-500" />
                  Навички
                </label>

                <button
                  type="button"
                  onClick={addSkill}
                  className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[9px] font-bold text-blue-600 shadow-sm transition-all hover:bg-blue-600 hover:text-white"
                >
                  <Plus size={10} />
                  Додати
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {formData.skills[activeLang]?.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-400"
                    />

                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="p-1.5 text-slate-300 transition-colors hover:text-red-500"
                      aria-label="Видалити навичку"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                <Award size={12} className="text-blue-500" />
                Досвід ({activeLang})
              </label>

              <textarea
                rows={3}
                value={formData.description[activeLang]}
                onChange={(e) =>
                  handleTextChange("description", e.target.value)
                }
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <footer className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
              {memberToEdit && (
                <button
                  type="button"
                  onClick={() => onDelete?.(memberToEdit.id!)}
                  className="text-[9px] font-bold tracking-widest text-red-400 uppercase transition-colors hover:text-red-600"
                >
                  Видалити профіль
                </button>
              )}

              <div className="flex w-full gap-2 sm:ml-auto sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-2 text-[10px] font-bold text-slate-400 uppercase hover:text-slate-600 sm:flex-none"
                >
                  Скасувати
                </button>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 rounded-xl bg-blue-600 px-8 py-3 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 disabled:bg-slate-300 sm:flex-none"
                >
                  {isUploading ? "Завантаження..." : "Зберегти"}
                </button>
              </div>
            </footer>
          </form>
        </div>
      </div>

      {selectedFileUrl && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-bold text-slate-700 uppercase">
                Налаштування фото
              </h3>

              <button
                type="button"
                onClick={handleCropCancel}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Закрити редактор фото"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-105 bg-black">
              <Cropper
                image={selectedFileUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedPixels) => {
                  setCroppedAreaPixels(croppedPixels);
                }}
              />
            </div>

            <div className="space-y-4 p-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  Масштаб
                </label>

                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCropCancel}
                  disabled={isUploading}
                  className="rounded-xl bg-slate-100 px-5 py-2 text-[10px] font-bold text-slate-600 uppercase disabled:opacity-50"
                >
                  Скасувати
                </button>

                <button
                  type="button"
                  onClick={handleCropSave}
                  disabled={isUploading || !croppedAreaPixels}
                  className="rounded-xl bg-blue-600 px-6 py-2 text-[10px] font-bold text-white uppercase hover:bg-blue-700 disabled:bg-slate-300"
                >
                  {isUploading ? "Завантаження..." : "Готово"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
