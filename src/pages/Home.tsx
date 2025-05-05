
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-budget-blue to-blue-700 text-white py-16">
          <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Crie orçamentos profissionais em minutos
              </h1>
              <p className="text-lg md:text-xl mb-8">
                Personalize, salve e compartilhe orçamentos de qualidade com seus clientes de forma rápida e descomplicada.
              </p>
              <div className="space-x-4">
                {user ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="bg-budget-green hover:bg-green-600 text-white">
                      Ir para o Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login">
                      <Button size="lg" className="bg-budget-green hover:bg-green-600 text-white">
                        Começar Agora
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-700">
                        Criar Conta
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-lg shadow-xl bg-white p-6 transform rotate-3">
                <div className="rounded border border-gray-200 p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <div className="font-bold text-gray-800">Orçamento para Cliente</div>
                    <div className="text-budget-green font-bold">APROVADO</div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between text-gray-700">
                      <span>Total:</span>
                      <span className="font-bold">R$ 3.500,00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Funcionalidades do Gerador de Orçamentos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 bg-budget-blue rounded-full flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Criação Fácil</h3>
                <p className="text-gray-600">Crie orçamentos detalhados com interface intuitiva e personalizável.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 bg-budget-green rounded-full flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Exportação em PDF</h3>
                <p className="text-gray-600">Baixe seus orçamentos em formato PDF profissional para enviar aos clientes.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 bg-budget-blue rounded-full flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Histórico Salvo</h3>
                <p className="text-gray-600">Acesse e edite seus orçamentos anteriores a qualquer momento.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Pronto para começar?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Crie sua conta agora e comece a gerar orçamentos profissionais para impressionar seus clientes.
            </p>
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-budget-green hover:bg-green-600 text-white">
                  Ir para o Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button size="lg" className="bg-budget-green hover:bg-green-600 text-white">
                  Criar Minha Conta Grátis
                </Button>
              </Link>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
