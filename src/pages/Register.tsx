export default function Register() {
  return <>
  <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-8">
  <header className="w-full flex justify-between items-center mb-12">
    <h1 className="text-2xl font-bold text-gray-800">CAT</h1>
    <nav className="space-x-6 text-gray-600">
      <a href="#" className="hover:text-gray-800">About</a>
      <a href="#" className="hover:text-gray-800">Services</a>
      <a href="#" className="hover:text-gray-800">Resources</a>
      <a href="#" className="hover:text-gray-800">Contact</a>
    </nav>
  </header>

  <div className="flex flex-col md:flex-row items-center gap-8">
    <div className="max-w-lg">
      <h2 className="text-5xl font-bold text-gray-800 mb-4">All About Cats</h2>
      <p className="text-lg text-gray-600 mb-6">
        Connecting you with everything you need to know about cats.
      </p>
      <button className="px-6 py-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-gray-900 font-medium">
        Learn More
      </button>
    </div>
    <img src="cat.jpg" alt="Elegant Cat" className="rounded-xl shadow-lg max-w-sm" />
  </div>
</div>
  </>;
}
