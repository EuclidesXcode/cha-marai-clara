import { useState, useEffect } from 'react';
import { TextField, Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Container, Divider } from '@mui/material';
import axios from 'axios';
import Image from 'next/image';

export default function Home() {
  const [nome, setNome] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState<'doacao' | 'finalizar' | null>(null);
  const [doacaoValor, setDoacaoValor] = useState<number | null>(null);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [numerosDisponiveis, setNumerosDisponiveis] = useState<boolean[]>(Array(101).fill(false));
  const [totalArrecadado, setTotalArrecadado] = useState(0);

  useEffect(() => {
    const fetchSelectedNumbers = async () => {
      try {
        const response = await axios.get('/api/getRifas');
        const num: number[] = response.data;
        setSelectedNumbers(num);

        const updatedDisponiveis = Array(101).fill(false);
        num.forEach((n) => (updatedDisponiveis[n] = true));
        setNumerosDisponiveis(updatedDisponiveis);
        setTotalArrecadado(num.length * 50);
      } catch (error) {
        console.error('Erro ao buscar números selecionados:', error);
      }
    };

    fetchSelectedNumbers();
  }, []);

  const qrCodeLink =
    '00020126450014BR.GOV.BCB.PIX0123euclideslione@gmail.com5204000053039865802BR5925Euclides Rufo Silva do Na6009SAO PAULO62140510a4R8CcgKFr630425E7';

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
      if(nome.trim() === '') {
        alert('Por favor, informe seu nome.');
      } else if (selectedNumbers.length === 0) {
        alert('Por favor, selecione ao menos um número.');
      } else {
        alert('Por favor, selecione ao menos um número e insira seu nome.');
      }
    }
    
    try {
      openModal('finalizar');
      const result = await axios.post('/api/saveRifa', { nome, numeros: selectedNumbers });
      console.log('SALVOU: ', result);
    } catch (error) {
      console.error('Erro ao finalizar rifa:', error);
    }
  };

  const handleDoacao = async () => {
    try {
      openModal('doacao');
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
      <Typography variant="h4" align="center" sx={{ color: '#F038F9' }} gutterBottom>
        Chá Digital da Maria Clara
      </Typography>
      <Typography variant="h6" align="center">
        Total arrecadado: R$ {totalArrecadado}
      </Typography>

      <TextField
        label="Seu nome"
        variant="outlined"
        fullWidth
        margin="normal"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <Grid container spacing={2}>
        {numerosDisponiveis.map((isAvailable, index) => (
          <Grid item xs={3} sm={2} md={1} key={index}>
            <Button
              fullWidth
              variant={isAvailable ? 'contained' : 'outlined'}
              color={isAvailable ? 'secondary' : 'primary'}
              onClick={() => handleNumberClick(index)}
              disabled={isAvailable}
            >
              {index}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Grid container justifyContent="center" spacing={2} sx={{ marginTop: 2 }}>
        {selectedNumbers.length > 0 && (
          <Grid item>
            <Button variant="contained" color="success" onClick={handleFinalizar}>
              Pagar Rifa
            </Button>
          </Grid>
        )}
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleDoacao}>
            Doação Voluntária
          </Button>
        </Grid>
      </Grid>

      {/* Modal Doação */}
      <Dialog open={modalIsOpen && modalType === 'doacao'} onClose={closeModal}>
        <DialogTitle>Doação Voluntária</DialogTitle>
        <DialogContent sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Image src="/qr-code-img.jpg" alt="QR Code" width={200} height={200} style={{borderRadius: 15}} />
          <Typography align="center" gutterBottom>
            Obrigado por participar!
          </Typography>
          <Divider />
          <TextField
            label="Valor da doação"
            type="number"
            fullWidth
            margin="normal"
            value={doacaoValor || ''}
            onChange={(e) => setDoacaoValor(Number(e.target.value))}
          />
          <Divider />
          <Button variant="contained" sx={{ backgroundColor: '#F038F9' }} fullWidth onClick={copyToClipboard}>
            Copiar Link para Pagamento
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="error">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Finalizar */}
      <Dialog open={modalIsOpen && modalType === 'finalizar'} onClose={closeModal}>
        <DialogTitle>QR Code para Pagamento</DialogTitle>
        <DialogContent sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Image src="/qr-code-img.jpg" alt="QR Code" width={200} height={200} style={{borderRadius: 15}} />
          <Divider />
          <Typography align="center" gutterBottom>
            Obrigado por participar, para melhor validação, escreva no pix os números comprados, ou me envie por WhatsApp (44) 9 9114-4705
          </Typography>
          <Divider />
          <Button variant="contained" sx={{ backgroundColor: '#F038F9' }} fullWidth onClick={copyToClipboard}>
            Copiar Link para Pagamento
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="error">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}