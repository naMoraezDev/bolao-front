export default function Footer() {
  return (
    <footer className="bg-white border-t border-line mt-auto">
      <div className="max-w-[1340px] mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <img
              src="https://lncimg.lance.com.br/cdn-cgi/image/width=168,height=64,quality=75,fit=pad,format=webp,background=transparent/uploads/2026/06/Logo_Lance-Copa-do-Mundo.png"
              alt="Lance!"
              className="h-8 w-auto object-contain"
            />
          </div>

          <p className="text-sm text-gray-300 text-center">
            &copy; {new Date().getFullYear()} Lance! Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
