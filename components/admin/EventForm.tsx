"use client";

import { useState } from "react";
import type { SpacewormEvent, EventStatus } from "@/lib/mockData";
import AdminFormField from "@/components/admin/AdminFormField";
import AdminSaveToast from "@/components/admin/AdminSaveToast";
import { useUnsavedChanges } from "@/lib/useUnsavedChanges";

type Props = {
  initialData?: SpacewormEvent;
  mode?: "create" | "edit";
  dangerZone?: React.ReactNode;
};

const inputClass =
  "w-full border border-zinc-300 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black transition-colors";
const selectClass =
  "w-full border border-zinc-300 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black transition-colors";

export default function EventForm({ initialData, mode = "edit", dangerZone }: Props) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [date, setDate] = useState(initialData?.date ?? "");
  const [hasEndDate, setHasEndDate] = useState(!!initialData?.endDate);
  const [endDate, setEndDate] = useState(initialData?.endDate ?? "");
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [venue, setVenue] = useState(initialData?.venue ?? "");
  const [status, setStatus] = useState<EventStatus>(
    initialData?.status ?? "upcoming"
  );
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useUnsavedChanges(isDirty);

  function markDirty() {
    setIsDirty(true);
  }

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSaved(true);
    setIsDirty(false);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleDiscard() {
    setTitle(initialData?.title ?? "");
    setDate(initialData?.date ?? "");
    setHasEndDate(!!initialData?.endDate);
    setEndDate(initialData?.endDate ?? "");
    setLocation(initialData?.location ?? "");
    setVenue(initialData?.venue ?? "");
    setStatus(initialData?.status ?? "upcoming");
    setDescription(initialData?.description ?? "");
    setErrors({});
    setIsDirty(false);
  }

  return (
    <>
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
                  onChange={(e) => {
                    setStatus(e.target.value as EventStatus);
                    markDirty();
                  }}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </AdminFormField>

              <AdminFormField
                label="Location"
                hint="City name, e.g. Lagos"
                error={errors.location}
              >
                <input
                  className={inputClass}
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    markDirty();
                  }}
                />
              </AdminFormField>
            </div>

            <AdminFormField label="Title" error={errors.title}>
              <input
                className={inputClass}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  markDirty();
                }}
              />
            </AdminFormField>

            <AdminFormField label="Venue" error={errors.venue}>
              <input
                className={inputClass}
                value={venue}
                onChange={(e) => {
                  setVenue(e.target.value);
                  markDirty();
                }}
              />
            </AdminFormField>

            <div className="grid grid-cols-2 gap-4">
              <AdminFormField label="Start Date" error={errors.date}>
                <input
                  type="date"
                  className={inputClass}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    markDirty();
                  }}
                />
              </AdminFormField>

              <AdminFormField label="" error={errors.endDate}>
                <label className="mb-1.5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <input
                    type="checkbox"
                    checked={hasEndDate}
                    onChange={(e) => {
                      setHasEndDate(e.target.checked);
                      markDirty();
                    }}
                    className="h-3.5 w-3.5 accent-black"
                  />
                  End Date
                </label>
                {hasEndDate ? (
                  <input
                    type="date"
                    className={`${inputClass}${errors.endDate ? " border-red-400" : ""}`}
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      markDirty();
                    }}
                  />
                ) : (
                  <div
                    className={`${inputClass} cursor-not-allowed bg-zinc-50 text-zinc-400`}
                  >
                    Single day
                  </div>
                )}
              </AdminFormField>
            </div>

            <AdminFormField label="Description">
              <textarea
                className={`${inputClass} resize-none`}
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  markDirty();
                }}
              />
            </AdminFormField>
          </div>
        </div>
      </form>

      {/* Danger zone slot */}
      {dangerZone && <div className="mt-10">{dangerZone}</div>}

      {/* Sticky save bar */}
      <div className="sticky bottom-0 -mx-6 mt-8 border-t border-zinc-200 bg-white px-6 py-4 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
        <div className="flex items-center gap-4">
          <button
            type="submit"
            form="event-form"
            className="bg-black px-8 py-3.5 text-xs font-black uppercase tracking-[0.25em] text-white transition-colors hover:bg-zinc-800"
          >
            {mode === "create" ? "Create Event" : "Save Changes"}
          </button>
          {isDirty && (
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
