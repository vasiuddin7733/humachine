const industries = [
  "Marketing",
  "Healthcare",
  "FinTech",
  "E-Commerce",
  "Education",
  "Startups"
]

export default function Industries() {
  return (
    <section className="py-20 bg-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10">Industries We Serve</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {industries.map((ind, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              {ind}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
