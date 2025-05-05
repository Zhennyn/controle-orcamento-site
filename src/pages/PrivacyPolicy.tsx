
import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Política de Privacidade</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              Esta Política de Privacidade descreve como suas informações pessoais são coletadas, 
              usadas e compartilhadas quando você utiliza o Gerador de Orçamentos Personalizados.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-700">1. Informações que Coletamos</h2>
            <p className="text-gray-600 mb-4">
              Quando você se cadastra em nosso serviço, coletamos as seguintes informações:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Nome completo</li>
              <li>Endereço de e-mail</li>
              <li>Senha (armazenada de forma segura e criptografada)</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Além disso, quando você cria orçamentos, coletamos dados relacionados aos seus documentos, 
              incluindo informações de clientes, descrições de serviços e valores.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-700">2. Como Usamos Suas Informações</h2>
            <p className="text-gray-600 mb-4">
              Utilizamos as informações coletadas para:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Fornecer, manter e melhorar nossos serviços</li>
              <li>Processar e gerenciar suas solicitações, orçamentos e transações</li>
              <li>Comunicar-nos com você sobre atualizações, recursos e ofertas</li>
              <li>Prevenir atividades fraudulentas e garantir a segurança de sua conta</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-700">3. Compartilhamento de Dados</h2>
            <p className="text-gray-600 mb-4">
              Não vendemos ou alugamos suas informações pessoais para terceiros. 
              Podemos compartilhar suas informações pessoais apenas nas seguintes circunstâncias:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Com provedores de serviços que nos auxiliam na operação do site</li>
              <li>Para cumprir obrigações legais</li>
              <li>Para proteger direitos, propriedade ou segurança</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-700">4. Segurança dos Dados</h2>
            <p className="text-gray-600 mb-4">
              Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger 
              suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-700">5. Seus Direitos</h2>
            <p className="text-gray-600 mb-4">
              Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento. 
              Para exercer esses direitos, entre em contato conosco através dos canais de suporte disponibilizados no site.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-700">6. Alterações na Política de Privacidade</h2>
            <p className="text-gray-600 mb-4">
              Podemos atualizar esta Política de Privacidade periodicamente. 
              Notificaremos você sobre alterações significativas publicando a nova Política de Privacidade nesta página.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-700">7. Contato</h2>
            <p className="text-gray-600 mb-4">
              Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade, 
              entre em contato conosco através do e-mail: contato@geradordeorcamentos.com.br
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

export default PrivacyPolicy;
