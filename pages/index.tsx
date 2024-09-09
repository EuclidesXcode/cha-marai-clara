import { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import Image from 'next/image';
import axios from 'axios';

interface NumberButtonProps {
  selected: boolean;
  disabled?: boolean;
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 30px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const TotalArrecadado = styled.h2`
  font-size: 20px;
  color: #3498db;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 10px;
  margin-top: 20px;
  padding: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(5, 1fr);
    padding: 20px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(4, 1fr);
    padding: 10px;
    gap: 5px;
  }
`;

const NumberButton = styled.button<NumberButtonProps>`
  padding: 10px 15px;
  background-color: transparent;
  border: 2px solid ${({ selected }) => (selected ? '#e74c3c' : '#2ecc71')};
  color: ${({ selected }) => (selected ? '#e74c3c' : '#2ecc71')};
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;

  &:disabled {
    border-color: #e74c3c;
    color: #e74c3c;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 12px;
  }
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  flex-direction: column;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const DoarButton = styled.button`
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

const FinalizarButton = styled.button`
  padding: 10px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

const QRCodeImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  @media (max-width: 768px) {
    margin-top: 15px;
  }

  @media (max-width: 480px) {
    margin-top: 10px;
  }
`;

const InfoText = styled.p`
  color: #555;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

ReactModal.setAppElement('#__next');

export default function Home() {
  const [nome, setNome] = useState<string>('');
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [totalArrecadado, setTotalArrecadado] = useState<number>(0);
  const [numerosDisponiveis, setNumerosDisponiveis] = useState<boolean[]>(Array(101).fill(false));
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);  // Modal para doação e rifa
  const [modalType, setModalType] = useState<'doacao' | 'rifa' | null>(null);  // Tipo de modal aberto
  const [doacaoValor, setDoacaoValor] = useState<number | null>(null);

  useEffect(() => {
    // Buscar números comprados ao iniciar
    const fetchComprados = async () => {
      try {
        const response = await axios.get('/api/getRifa');
        const numerosComprados: number[] = response.data;
        setNumerosDisponiveis((prev) => {
          const updated = [...prev];
          numerosComprados.forEach((numero) => {
            updated[numero] = true;
          });
          return updated;
        });
      } catch (error) {
        console.error('Erro ao buscar números comprados:', error);
      }
    };

    fetchComprados();
  }, []);

  const openModal = (type: 'doacao' | 'rifa') => {
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
      alert('Rifa finalizada com sucesso!');
      setSelectedNumbers([]);
      setTotalArrecadado(0);
      setNumerosDisponiveis(Array(101).fill(false));
    } catch (error) {
      console.error('Erro ao finalizar rifa:', error);
    }
  };

  const handleDoacao = async () => {
    if (!doacaoValor) return;
    try {
      // Aqui você pode implementar o código para processar a doação
      // Exibindo o QR Code e o aviso
      setModalType('rifa');
    } catch (error) {
      console.error('Erro ao processar doação:', error);
    }
  };

  return (
    <Container>
      <Title>Chá Digital da Maria Clara</Title>
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
        <Input
          type="number"
          value={doacaoValor || ''}
          onChange={(e) => setDoacaoValor(Number(e.target.value))}
          placeholder="Informe o valor da doação"
        />
        <ButtonGroup>
          <DoarButton onClick={handleDoacao}>Concluir Doação</DoarButton>
          <button
            onClick={closeModal}
            style={{
              padding: '10px 20px',
              backgroundColor: '#e74c3c',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Fechar
          </button>
        </ButtonGroup>
      </ReactModal>
      <ReactModal
        isOpen={modalIsOpen && modalType === 'rifa'}
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
          Por favor informe os números selecionados para validação, pode informar diretamente no pix ou no WhatsApp (44) 9 9114-4705
        </InfoText>
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
          Finalizar Pagamento
        </button>
      </ReactModal>
    </Container>
  );
}