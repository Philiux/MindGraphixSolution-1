import React from 'react'

const Services: React.FC = () => {
  const services = [
    {
      title: "Design Graphique",
      description: "Création de visuels uniques et impactants pour renforcer votre identité de marque",
      icon: "🎨"
    },
    {
      title: "Développement Web",
      description: "Sites web performants, responsives et optimisés pour le référencement",
      icon: "💻"
    },
    {
      title: "Consultation Digitale",
      description: "Conseils stratégiques personnalisés pour votre transformation digitale",
      icon: "📊"
    }
  ]

  return (
    <section className="py-20 bg-high-contrast">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-high-contrast">
          Nos Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="service-card p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="text-4xl mb-6 text-center">{service.icon}</div>
              <h3 className="text-2xl font-semibold mb-4 text-center text-high-contrast">
                {service.title}
              </h3>
              <p className="text-lg text-center text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
