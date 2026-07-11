const Loader = ({ label = "Loading..." }) => (
  <div className="flex items-center justify-center gap-2 py-10 text-gray-500 text-sm">
    <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
    {label}
  </div>
);

export default Loader;