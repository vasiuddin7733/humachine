import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="w-full bg-primary text-white min-h-screen flex items-center justify-center flex-col text-center py-20">
      <div className="px-6">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-6"
        >
          Build Scalable Software Tools
        </motion.h1>

        <p className="text-lg text-gray-300 max-w-xl mb-8">
          We design and develop high-performance software tools for startups,
          enterprises, and digital teams.
        </p>

        <button className="bg-secondary px-6 py-3 rounded-md font-semibold hover:bg-blue-700">
          Get Free Consultation
        </button>
      </div>
    </section>
  )
}
