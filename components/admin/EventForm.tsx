"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { DBEvent } from "@/lib/database.types";
import AdminFormField from "@/components/admin/AdminFormField";
import AdminSaveToast from "@/components/admin/AdminSaveToast";
import ImageUploader from "@/components/admin/ImageUploader";
import { useUnsavedChanges } from "@/lib/useUnsavedChanges";
import { uploadFile } from "@/lib/upload";

type Props = {
  initialData?: DBEvent;
  mode?: "create" | "edit";
  dangerZone?: React.ReactNode;
};

const inputClass =
  "w-full border border-zinc-300 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black transition-colors";
const selectClass =
  "w-full border border-zinc-300 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black transition-colors";

export default function EventForm({ initialData, mode = "edit", dangerZone }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [date, setDate] = useState(initialData?.date ?? "");
  const [hasEndDate, setHasEndDate] = useState(!!initialData?.end_date);
  const [endDate, setEndDate] = useState(initialData?.end_date ?? "");
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [venue, setVenue] = useState(initialData?.venue ?? "");
  const [status, setStatus] = useState(initialData?.status ?? "upcoming");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [details, setDetails] = useState(initialData?.details ?? "");
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? "");
  const [ticketUrl, setTicketUrl] = useState(initialData?.ticket_url ?? "");
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery ?? []);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  useUnsavedChanges(isDirty);

  function markDirty() { setIsDirty(true); }

  function validate() {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Title is required";
    if (!location.trim()) errs.location = "Location is required";
    if (!venue.trim()) errs.venue = "Venue is required";
    if (!date) errs.date = "Date is required";
    if (hasEndDate && endDate && date && endDate < date)
      errs.endDate = "End date must be after start date";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setErrors({});
    setSaving(true);
    setSaveError("");

    const payload = {
      title: title.trim(),
      slug: slug.trim() || null,
      date,
      end_date: hasEndDate && endDate ? endDate : null,
      location: location.trim(),
      venue: venue.trim(),
      status,
      description: description.trim() || null,
      details: details.trim() || null,
      image_url: imageUrl.trim() || null,
      gallery,
      ticket_url: ticketUrl.trim() || null,
    };

    try {
      const url = mode === "create"
        ? "/api/admin/events"
        : `/api/admin/events/${initialData!.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) { setSaveError(data.error ?? "Save failed."); return; }

      setIsDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);

      if (mode === "create") {
        router.push(`/admin/events/${data.id}`);
      } else {
        router.refresh();
      }
    } catch {
      setSaveError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    setTitle(initialData?.title ?? "");
    setSlug(initialData?.slug ?? "");
    setDate(initialData?.date ?? "");
    setHasEndDate(!!initialData?.end_date);
    setEndDate(initialData?.end_date ?? "");
    setLocation(initialData?.location ?? "");
    setVenue(initialData?.venue ?? "");
    setStatus(initialData?.status ?? "upcoming");
    setDescription(initialData?.description ?? "");
    setDetails(initialData?.details ?? "");
    setImageUrl(initialData?.image_url ?? "");
    setGallery(initialData?.gallery ?? []);
    setTicketUrl(initialData?.ticket_url ?? "");
    setErrors({});
    setIsDirty(false);
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        <form id="event-form" onSubmit={handleSubmit}>
          <div className="border border-zinc-200 bg-white p-6">
            <h2 className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              Event Details
            </h2>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <AdminFormField label="Status">
                  <select
                    className={selectClass}
                    value={status}
                    onChange={(e) => { setStatus(e.target.value); markDirty(); }}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                  </select>
                </AdminFormField>

                <AdminFormField label="Location" hint="City name, e.g. Lagos" error={errors.location}>
                  <input
                    className={inputClass}
                    value={location}
                    onChange={(e) => { setLocation(e.target.value); markDirty(); }}
                  />
                </AdminFormField>
              </div>

              <AdminFormField label="Title" error={errors.title}>
                <input
                  className={inputClass}
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); markDirty(); }}
                />
              </AdminFormField>

              <AdminFormField label="Slug" hint="URL path — leave blank to auto-generate from title">
                <input
                  className={inputClass}
                  value={slug}
                  onChange={(e) => { setSlug(e.target.value); markDirty(); }}
                  placeholder="no-signal-pop-up"
                />
              </AdminFormField>

              <AdminFormField label="Venue" error={errors.venue}>
                <input
                  className={inputClass}
                  value={venue}
                  onChange={(e) => { setVenue(e.target.value); markDirty(); }}
                />
              </AdminFormField>

              <div className="grid grid-cols-2 gap-4">
                <AdminFormField label="Start Date" error={errors.date}>
                  <input
                    type="date"
                    className={inputClass}
                    value={date}
                    onChange={(e) => { setDate(e.target.value); markDirty(); }}
                  />
                </AdminFormField>

                <AdminFormField label="" error={errors.endDate}>
                  <label className="mb-1.5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <input
                      type="checkbox"
                      checked={hasEndDate}
                      onChange={(e) => { setHasEndDate(e.target.checked); markDirty(); }}
                      className="h-3.5 w-3.5 accent-black"
                    />
                    End Date
                  </label>
                  {hasEndDate ? (
                    <input
                      type="date"
                      className={`${inputClass}${errors.endDate ? " border-red-400" : ""}`}
                      value={endDate}
                      onChange={(e) => { setEndDate(e.target.value); markDirty(); }}
                    />
                  ) : (
                    <div className={`${inputClass} cursor-not-allowed bg-zinc-50 text-zinc-400`}>
                      Single day
                    </div>
                  )}
                </AdminFormField>
              </div>

              <AdminFormField label="Short Description" hint="One-line tagline shown in listings">
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={2}
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); markDirty(); }}
                />
              </AdminFormField>

              <AdminFormField label="Details" hint="Long-form body shown on the event detail page">
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={6}
                  value={details}
                  onChange={(e) => { setDetails(e.target.value); markDirty(); }}
                />
              </AdminFormField>

              <AdminFormField label="Ticket / RSVP URL" hint="Optional external link for tickets or sign-up">
                <input
                  className={inputClass}
                  value={ticketUrl}
                  onChange={(e) => { setTicketUrl(e.target.value); markDirty(); }}
                  placeholder="https://…"
                />
              </AdminFormField>
            </div>
          </div>
        </form>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Cover Image */}
          <div className="border border-zinc-200 bg-white p-6">
            <h2 className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              Cover Image
            </h2>
            <ImageUploader
              value={imageUrl}
              onChange={(url) => { setImageUrl(url); markDirty(); }}
              bucket="event-images"
              aspect="16/9"
            />
          </div>

          {/* Gallery */}
          <div className="border border-zinc-200 bg-white p-6">
            <h2 className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              Gallery ({gallery.length})
            </h2>
            <p className="mb-3 text-[9px] font-semibold uppercase tracking-widest text-zinc-300">
              Photos from the event
            </p>
            <div className="flex flex-col gap-3">
              {gallery.map((url, i) => (
                <div key={i} className="group flex items-center gap-3">
                  <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden border border-zinc-200 bg-zinc-50">
                    <Image src={url} alt="" fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <p className="truncate text-[10px] text-zinc-400">{url.split("/").pop()}</p>
                    <div className="flex items-center gap-2">
                      {i > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setGallery((prev) => {
                              const next = [...prev];
                              [next[i - 1], next[i]] = [next[i], next[i - 1]];
                              return next;
                            });
                            markDirty();
                          }}
                          className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 hover:text-black"
                        >
                          ↑
                        </button>
                      )}
                      {i < gallery.length - 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setGallery((prev) => {
                              const next = [...prev];
                              [next[i], next[i + 1]] = [next[i + 1], next[i]];
                              return next;
                            });
                            markDirty();
                          }}
                          className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 hover:text-black"
                        >
                          ↓
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setGallery((prev) => prev.filter((_, j) => j !== i));
                          markDirty();
                        }}
                        className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              multiple
              className="hidden"
              onChange={async (e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length === 0) return;
                setGalleryUploading(true);
                setGalleryProgress({ done: 0, total: files.length });

                for (let i = 0; i < files.length; i++) {
                  try {
                    const result = await uploadFile(files[i], "event-images");
                    setGallery((prev) => [...prev, result.url]);
                    markDirty();
                  } catch {
                    // skip failed uploads
                  }
                  setGalleryProgress({ done: i + 1, total: files.length });
                }

                setGalleryUploading(false);
                setGalleryProgress({ done: 0, total: 0 });
                e.target.value = "";
              }}
            />

            {/* Upload progress bar */}
            {galleryUploading && galleryProgress.total > 0 && (
              <div className="mt-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                    Uploading {galleryProgress.done}/{galleryProgress.total}
                  </span>
                  <span className="text-[10px] font-bold text-black">
                    {Math.round((galleryProgress.done / galleryProgress.total) * 100)}%
                  </span>
                </div>
                <div className="h-1 w-full overflow-hidden bg-zinc-200">
                  <div
                    className="h-full bg-black transition-all duration-300"
                    style={{ width: `${(galleryProgress.done / galleryProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={galleryUploading}
              className="mt-3 w-full border border-dashed border-zinc-300 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-colors hover:border-black hover:text-black disabled:opacity-50"
            >
              {galleryUploading ? "Uploading…" : "+ Add Photos"}
            </button>
          </div>
        </div>
      </div>

      {dangerZone && <div className="mt-10">{dangerZone}</div>}

      {saveError && (
        <p className="mt-4 text-[10px] font-semibold text-red-500">{saveError}</p>
      )}

      {/* Sticky save bar */}
      <div className="sticky bottom-0 -mx-6 mt-8 border-t border-zinc-200 bg-white px-6 py-4 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
        <div className="flex items-center gap-4">
          <button
            type="submit"
            form="event-form"
            disabled={saving}
            className="bg-black px-8 py-3.5 text-xs font-black uppercase tracking-[0.25em] text-white transition-colors hover:bg-zinc-800 disabled:bg-zinc-400"
          >
            {saving ? "Saving…" : mode === "create" ? "Create Event" : "Save Changes"}
          </button>
          {isDirty && !saving && (
            <>
              <button
                type="button"
                onClick={handleDiscard}
                className="text-xs font-semibold uppercase tracking-widest text-zinc-400 transition-colors hover:text-black"
              >
                Discard
              </button>
              <span className="hidden text-[10px] font-semibold uppercase tracking-widest text-zinc-400 sm:inline">
                Unsaved changes
              </span>
            </>
          )}
        </div>
      </div>

      <AdminSaveToast visible={saved} />
    </>
  );
}
