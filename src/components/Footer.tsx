export default function Footer() {
  return (
    <footer className="bg-white border-t border-line mt-auto">
      <div className="max-w-[1340px] mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-xs">L</span>
            </div>
            <span className="font-display font-bold text-base text-black-lance">
              Lance! Bolão
            </span>
          </div>

          <p className="text-sm text-gray-300 text-center">
            &copy; {new Date().getFullYear()} Lance! Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
