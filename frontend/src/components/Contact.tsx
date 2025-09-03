import React from 'react'

const Contact: React.FC = () => {
  return (
    <section className="contact-section py-20 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Contactez-nous
        </h2>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Informations de contact */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6">Discutons de votre projet</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <span className="text-xl">📧</span>
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-purple-100">contact@mindgraphix.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <span className="text-xl">📞</span>
                </div>
                <div>
                  <p className="font-semibold">Téléphone</p>
                  <p className="text-purple-100">+33 1 23 45 67 89</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <span className="text-xl">📍</span>
                </div>
                <div>
                  <p className="font-semibold">Adresse</p>
                  <p className="text-purple-100">123 Avenue du Digital, Paris</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-purple-100">
            <form className="space-y-6">
              <div>
                <input 
                  type="text" 
                  placeholder="Votre nom complet" 
                  className="form-input w-full p-4 text-gray-800"
                  required
                />
              </div>
              
              <div>
                <input 
                  type="email" 
                  placeholder="Votre adresse email" 
                  className="form-input w-full p-4 text-gray-800"
                  required
                />
              </div>
              
              <div>
                <input 
                  type="text" 
                  placeholder="Sujet de votre message" 
                  className="form-input w-full p-4 text-gray-800"
                />
              </div>
              
              <div>
                <textarea 
                  placeholder="Décrivez votre projet en détail..." 
                  rows={5}
                  className="form-input w-full p-4 text-gray-800 resize-none"
                  required
                />
              </div>
              
              <button 
                type="submit"
                className="btn-primary w-full py-4 text-lg font-semibold rounded-xl"
              >
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
