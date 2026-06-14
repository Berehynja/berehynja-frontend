import { useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import {
  X,
  Plus,
  Trash2,
  Camera,
  CheckCircle2,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Wrench,
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
    value: string
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
        croppedAreaPixels
      );

      const croppedFile = new File([croppedBlob], "team-member.jpg", {
        type: "image/jpeg",
      });

      const result = await uploadMedia(
        croppedFile,
        "team",
        formData.name[activeLang]?.trim() || "member"
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
        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
          <User size={64} className="opacity-50" />
        </div>
      );
    }

    if (formData.image) {
      return (
        <img
          src={formData.image}
          className="w-full h-full object-cover"
          alt="Preview"
        />
      );
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1 text-center px-2">
        <Camera size={20} />
        <span className="text-[9px] font-bold uppercase">Фото</span>
      </div>
    );
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3"
        onClick={onClose}
      >
        <div
          className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
              {memberToEdit ? "Редагування профілю" : "Новий фахівець"}
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
            >
              <X size={20} />
            </button>
          </header>

          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 overflow-y-auto space-y-6 custom-scrollbar"
          >
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start border-b border-slate-50 pb-6">
              <div className="flex gap-3 items-center md:items-start shrink-0">
                <div className="relative w-32 h-40 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden group">
                  {renderImagePreview()}

                  <label className="absolute inset-0 cursor-pointer bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <Plus className="text-white" size={24} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-2 justify-center">
                  {formData.image ? (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      title="Видалити фотографію/заглушку"
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
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
                      title="Встановити універсальну заглушку"
                    >
                      <User size={20} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 w-full space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Мова заповнення:
                </label>

                <div className="flex p-1 bg-slate-100 rounded-xl gap-1">
                  {(["ua", "de", "en"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveLang(lang)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                        activeLang === lang
                          ? "bg-white shadow text-blue-600"
                          : "text-slate-500"
                      }`}
                    >
                      {lang}
                      {formData.name[lang] && (
                        <CheckCircle2
                          size={10}
                          className="inline ml-1 text-green-500"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                  <User size={12} className="text-blue-500" />
                  Ім'я ({activeLang})
                </label>

                <input
                  required
                  value={formData.name[activeLang]}
                  onChange={(e) => handleTextChange("name", e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
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
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
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
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                  <Wrench size={12} className="text-blue-500" />
                  Навички
                </label>

                <button
                  type="button"
                  onClick={addSkill}
                  className="text-[9px] font-bold text-blue-600 bg-white px-2 py-1 rounded-lg shadow-sm hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1"
                >
                  <Plus size={10} />
                  Додати
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formData.skills[activeLang]?.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-400"
                    />

                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
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
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm resize-none"
              />
            </div>

            <footer className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-100 gap-4 mt-4">
              {memberToEdit && (
                <button
                  type="button"
                  onClick={() => onDelete?.(memberToEdit.id!)}
                  className="text-[9px] font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
                >
                  Видалити профіль
                </button>
              )}

              <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-6 py-2 text-[10px] font-bold uppercase text-slate-400 hover:text-slate-600"
                >
                  Скасувати
                </button>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:bg-slate-300"
                >
                  {isUploading ? "Завантаження..." : "Зберегти"}
                </button>
              </div>
            </footer>
          </form>
        </div>
      </div>

      {selectedFileUrl && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700 uppercase">
                Налаштування фото
              </h3>

              <button
                type="button"
                onClick={handleCropCancel}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative w-full h-[420px] bg-black">
              <Cropper
                image={selectedFileUrl}
                crop={crop}
                zoom={zoom}
                aspect={4 / 5}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedPixels) => {
                  setCroppedAreaPixels(croppedPixels);
                }}
              />
            </div>

            <div className="p-5 space-y-4">
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
                  className="px-5 py-2 rounded-xl bg-slate-100 text-slate-600 text-[10px] font-bold uppercase disabled:opacity-50"
                >
                  Скасувати
                </button>

                <button
                  type="button"
                  onClick={handleCropSave}
                  disabled={isUploading || !croppedAreaPixels}
                  className="px-6 py-2 rounded-xl bg-blue-600 text-white text-[10px] font-bold uppercase hover:bg-blue-700 disabled:bg-slate-300"
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