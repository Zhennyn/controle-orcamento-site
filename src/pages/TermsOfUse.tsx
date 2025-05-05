
import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const TermsOfUse: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Termos de Uso</h1>
          
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-700">1. Aceitação dos Termos</h2>
            <p className="text-gray-600 mb-4">
              Ao acessar e utilizar o Gerador de Orçamentos Personalizados, você concorda em cumprir 
              estes Termos de Uso. Se você não concordar com algum dos termos abaixo, 
              por favor, não utilize nosso serviço.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-700">2. Descrição do Serviço</h2>
            <p className="text-gray-600 mb-4">
              O Gerador de Orçamentos Personalizados é uma plataforma online que permite aos usuários 
              criar, editar e gerenciar orçamentos personalizados para seus clientes. A plataforma 
              oferece ferramentas para adicionar itens, definir preços, e exportar documentos em formato PDF.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-700">3. Conta do Usuário</h2>
            <p className="text-gray-600 mb-4">
              Para utilizar nossos serviços, você deve criar uma conta fornecendo informações precisas e completas. 
              Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrerem 
              em sua conta. Você concorda em notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-700">4. Propriedade Intelectual</h2>
            <p className="text-gray-600 mb-4">
              Todo o conteúdo disponibilizado em nosso serviço, incluindo textos, gráficos, logotipos, ícones, 
              imagens, clipes de áudio, downloads digitais e compilações de dados, é de propriedade do Gerador de Orçamentos 
              Personalizados ou de seus provedores de conteúdo e está protegido pelas leis internacionais de direitos autorais.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-700">5. Limitações de Uso</h2>
            <p className="text-gray-600 mb-4">
              Você concorda em não utilizar o serviço para:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Atividades ilegais ou fraudulentas</li>
              <li>Coletar ou armazenar dados pessoais de outros usuários</li>
              <li>Interferir no funcionamento adequado da plataforma</li>
              <li>Distribuir vírus ou qualquer tecnologia maliciosa</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-700">6. Alterações nos Termos</h2>
            <p className="text-gray-600 mb-4">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. 
              As alterações entrarão em vigor após a publicação dos termos atualizados. 
              O uso continuado do serviço após tais alterações constitui sua aceitação dos novos termos.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-700">7. Rescisão</h2>
            <p className="text-gray-600 mb-4">
              Podemos encerrar ou suspender o acesso ao nosso serviço imediatamente, sem aviso prévio, 
              por qualquer motivo, incluindo, sem limitação, violação dos Termos.
            </p>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Link to="/">
              <Button variant="outline">Voltar para Home</Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfUse;
