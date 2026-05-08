type Props = {
  visible: boolean;
  message?: string;
};

export default function AdminSaveToast({ visible, message = "Saved (mock)" }: Props) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 bg-black px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      {message}
    </div>
  );
}
