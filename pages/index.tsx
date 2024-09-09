import { useState } from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import Image from 'next/image';

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
    grid-template-columns: repeat(5, 1fr); /* Reduz o número de botões por linha */
    padding: 20px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(4, 1fr); /* Ainda mais compactado para telas menores */
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

  const openModal = (type: 'doacao' | 'rifa') => {
    setModalType(type);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setDoacaoValor(null);  // Reseta o valor da doação
  };

  const handleDoacaoSubmit = () => {
    if (doacaoValor) {
      closeModal();
    } else {
      alert('Por favor, insira um valor válido.');
    }
  };

  const handleNumberClick = (number: number) => {
    if (!numerosDisponiveis[number]) {
      setSelectedNumbers([...selectedNumbers, number]);
      setNumerosDisponiveis((prev) => {
        const updated = [...prev];
        updated[number] = true;
        return updated;
      });
      setTotalArrecadado(totalArrecadado + 50);  // Cada número custa 50 reais
    }
  };

  return (
    <Container>
      <Title>Obrigado por participar do Chá Digital da Maria Clara!</Title>
      <TotalArrecadado>Total arrecadado: R$ {totalArrecadado}</TotalArrecadado>

      <Input
        type="text"
        placeholder="Digite seu nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <ButtonGrid>
        {Array.from({ length: 101 }, (_, i) => (
          <NumberButton
            key={i}
            selected={numerosDisponiveis[i]}
            onClick={() => handleNumberClick(i)}
            disabled={numerosDisponiveis[i]}
          >
            {i}
          </NumberButton>
        ))}
      </ButtonGrid>

      <ButtonGroup>
        <DoarButton onClick={() => openModal('doacao')}>Doação Voluntária</DoarButton>

        {selectedNumbers.length > 0 && (
          <FinalizarButton onClick={() => openModal('rifa')}>Finalizar Rifa</FinalizarButton>
        )}
      </ButtonGroup>

      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            padding: '40px',
            maxWidth: '500px',
            margin: 'auto',
            textAlign: 'center'
          }
        }}
      >
        {modalType === 'doacao' ? (
          <>
            <h2>Digite o valor da doação</h2>
            <input
              type="number"
              placeholder="Digite o valor"
              value={doacaoValor || ''}
              onChange={(e) => setDoacaoValor(Number(e.target.value))}
              style={{
                padding: '10px',
                fontSize: '16px',
                marginBottom: '20px',
                borderRadius: '5px',
                border: '1px solid #ccc'
              }}
            />
            <button
              onClick={handleDoacaoSubmit}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3498db',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Confirmar Doação
            </button>
          </>
        ) : (
          <>
            <h2>Pagamento da Rifa</h2>
            <QRCodeImageContainer>
              <Image
                src="/assets/image/qr-code-img.jpg"
                alt="QR Code para pagamento"
                width={200}
                height={200}
              />
            </QRCodeImageContainer>
            <InfoText>
              Por favor informe os números selecionados para validação, pode informar diretamente no pix ou no WhatsApp (44) 9 9114-4705.
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
          </>
        )}
      </ReactModal>
    </Container>
  );
}