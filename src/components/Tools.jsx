const tools = [
  "React", "Node.js", "MongoDB",
  "Docker", "AWS", "GitHub"
]

export default function Tools() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10">Tools & Technologies</h2>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
          {tools.map((tool, i) => (
            <div
              key={i}
              className="border p-4 rounded text-center font-medium"
            >
              {tool}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
