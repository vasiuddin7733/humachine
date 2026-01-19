const services = [
  "Custom Software Development",
  "SaaS Platforms",
  "Web & Mobile Apps",
  "AI Automation Tools",
  "Cloud & DevOps"
]

export default function Services() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12">Our Services</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg">{s}</h3>
              <p className="text-gray-600 mt-3">
                Scalable, secure, and tailored to your business needs.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
