import { useState } from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import Image from 'next/image';
import styled from 'styled-components';

ReactModal.setAppElement('#__next'); // Para acessibilidade

const Container = styled.div`
  padding: 30px;
`;

const Title = styled.h1`
  text-align: center;
`;

const TotalArrecadado = styled.h2`
  text-align: center;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 10px;
  margin: 20px 0;
`;

const NumberButton = styled.button<{ selected: boolean }>`
  width: 100%;
  padding: 10px;
  border: 2px solid ${(props) => (props.selected ? 'red' : 'green')};
  background: transparent;
  color: ${(props) => (props.selected ? 'red' : 'green')};
  border-radius: 5px;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const DoarButton = styled.button`
  padding: 10px 20px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const FinalizarButton = styled.button`
  padding: 10px 20px;
  background-color: #2ecc71;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const QRCodeImageContainer = styled.div`
  text-align: center;
`;

const InfoText = styled.p`
  text-align: center;
  margin-top: 10px;
`;

const CopyButton = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Home() {
  const [nome, setNome] = useState('');
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [numerosDisponiveis, setNumerosDisponiveis] = useState<boolean[]>(Array(101).fill(false));
  const [totalArrecadado, setTotalArrecadado] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState<'doacao' | 'finalizar' | null>(null);
  const [doacaoValor, setDoacaoValor] = useState<number | null>(null);

  const qrCodeLink = '00020126450014BR.GOV.BCB.PIX0123euclideslione@gmail.com5204000053039865802BR5925Euclides Rufo Silva do Na6009SAO PAULO62140510a4R8CcgKFr630425E7';

  const openModal = (type: 'doacao' | 'finalizar') => {
    setModalType(type);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalType(null);
  };

  const handleNumberClick = (numero: number) => {
    if (numerosDisponiveis[numero]) return;
    setSelectedNumbers((prev) => [...prev, numero]);
    setNumerosDisponiveis((prev) => {
      const updated = [...prev];
      updated[numero] = true;
      return updated;
    });
    setTotalArrecadado((prev) => prev + 50);
  };

  const handleFinalizar = async () => {
    if (nome.trim() === '' || selectedNumbers.length === 0) {
      alert('Por favor, informe seu nome e selecione pelo menos um número.');
      return;
    }

    try {
      await axios.post('/api/saveRifa', { nome, numeros: selectedNumbers });
      openModal('finalizar');
    } catch (error) {
      console.error('Erro ao finalizar rifa:', error);
    }
  };

  const handleDoacao = async () => {
    if (!doacaoValor) return;
    try {
      // Aqui você pode implementar o código para processar a doação
      // Exibindo o QR Code e o aviso
      setModalType('doacao');
      setModalIsOpen(true);
    } catch (error) {
      console.error('Erro ao processar doação:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrCodeLink);
    alert('Link copiado para a área de transferência!');
  };

  return (
    <Container>
      <Title color='#F038F9'>Chá Digital da Maria Clara</Title>
      <TotalArrecadado>Total arrecadado: R$ {totalArrecadado}</TotalArrecadado>
      <Input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Seu nome"
      />
      <ButtonGrid>
        {numerosDisponiveis.map((isAvailable, index) => (
          <NumberButton
            key={index}
            selected={isAvailable}
            onClick={() => handleNumberClick(index)}
            disabled={isAvailable}
          >
            {index}
          </NumberButton>
        ))}
      </ButtonGrid>
      <ButtonGroup>
        {selectedNumbers.length > 0 && (
          <FinalizarButton onClick={handleFinalizar}>Finalizar Rifa</FinalizarButton>
        )}
        <DoarButton onClick={() => openModal('doacao')}>Doação Voluntária</DoarButton>
      </ButtonGroup>
      <ReactModal
        isOpen={modalIsOpen && modalType === 'doacao'}
        onRequestClose={closeModal}
        style={{
          content: {
            maxWidth: '500px',
            margin: 'auto',
            padding: '20px',
          },
        }}
      >
        <h2>Doação Voluntária</h2>
        <QRCodeImageContainer>
          <Image src="/assets/image/qr-code-img.jpg" alt="QR Code" width={200} height={200} />
        </QRCodeImageContainer>
        <InfoText>
          Obrigado por participar!
        </InfoText>
        <Input
          type="number"
          value={doacaoValor || ''}
          onChange={(e) => setDoacaoValor(Number(e.target.value))}
          placeholder="Informe o valor da doação"
        />
        <CopyButton onClick={copyToClipboard}>
          Copiar Link para Pagamento
        </CopyButton>
        <button
          onClick={closeModal}
          style={{
            padding: '10px 20px',
            backgroundColor: '#e74c3c',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          Fechar
        </button>
      </ReactModal>
      <ReactModal
        isOpen={modalIsOpen && modalType === 'finalizar'}
        onRequestClose={closeModal}
        style={{
          content: {
            maxWidth: '500px',
            margin: 'auto',
            padding: '20px',
          },
        }}
      >
        <h2>QR Code para Pagamento</h2>
        <QRCodeImageContainer>
          <Image src="/assets/image/qr-code-img.jpg" alt="QR Code" width={200} height={200} />
        </QRCodeImageContainer>
        <InfoText>
          Obrigado por participar, para melhor validação, escreva no pix os números comprados, ou me envie por WhatsApp (44) 9 9114-4705
        </InfoText>
        <CopyButton onClick={copyToClipboard}>
          Copiar Link para Pagamento
        </CopyButton>
        <button
          onClick={closeModal}
          style={{
            padding: '10px 20px',
            backgroundColor: '#e74c3c',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          Fechar
        </button>
      </ReactModal>
    </Container>
  );
}