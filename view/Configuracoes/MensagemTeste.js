// // import React, { useState, useEffect } from 'react';
// // import { View, Text, Button, TextInput } from 'react-native';
// // import * as Clipboard from 'expo-clipboard';
// // import { Share } from 'react-native';
// // import { AtualizarMensagemAsync, ObterMensagemAsync } from '../../services/mensagemService';

// // export default function DetalhesAtendimento() {
// //   const [mensagem, setMensagem] = useState("Carregando...");  // Valor inicial para mostrar até carregar a mensagem
// //   const [novaMensagem, setNovaMensagem] = useState("");  // Para capturar a mensagem do TextInput

// //   // Função para obter a mensagem do banco ao carregar o componente
// //   useEffect(() => {
// //     async function carregarMensagem() {
// //       const resposta = await ObterMensagemAsync();
// //       if (resposta.success && resposta.data) {
// //         setMensagem(resposta.data);
// //       } else {
// //         setMensagem("Erro ao carregar mensagem.");
// //       }
// //     }

// //     carregarMensagem();
// //   }, []);

// //   // Atualizar a mensagem no banco
// //   async function atualizarMensagemBanco() {
// //     const resposta = await AtualizarMensagemAsync(novaMensagem);
// //     if (resposta.success) {
// //       setMensagem(novaMensagem);  // Atualiza a mensagem exibida
// //       alert("Mensagem atualizada com sucesso!");
// //     } else {
// //       alert("Erro ao atualizar a mensagem: " + resposta.error);
// //     }
// //   }

// //   // Copiar para a área de transferência
// //   function copiarParaClipboard() {
// //     Clipboard.setStringAsync(mensagem) // Usando setStringAsync
// //       .then(() => {
// //         alert("Texto copiado para a área de transferência!");
// //       })
// //       .catch((erro) => {
// //         console.error("Erro ao copiar para a área de transferência", erro);
// //       });
// //   }

// //   // Compartilhar o texto
// //   async function compartilharTexto() {
// //     try {
// //       await Share.share({
// //         message: mensagem,
// //       });
// //     } catch (erro) {
// //       console.error("Erro ao compartilhar", erro);
// //     }
// //   }

// //   return (
// //     <View style={{ padding: 20 }}>
// //       <Text>{mensagem}</Text>
// //       <Button title="Alterar mensagem" onPress={() => setNovaMensagem(mensagem)} />
      
// //       {/* Campo para digitar a nova mensagem */}
// //       <TextInput
// //         value={novaMensagem}
// //         onChangeText={setNovaMensagem}
// //         placeholder="Digite uma nova mensagem"
// //         style={{
// //           borderWidth: 1,
// //           marginVertical: 10,
// //           padding: 10,
// //           borderRadius: 5,
// //         }}
// //       />
      
// //       <Button title="Salvar nova mensagem" onPress={atualizarMensagemBanco} />
// //       <Button title="Copiar para a área de transferência" onPress={copiarParaClipboard} />
// //       <Button title="Compartilhar" onPress={compartilharTexto} />
// //     </View>
// //   );
// // }

// import React, { useState } from 'react';
// import { View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';

// export default function PersonalizarMensagem() {
//   const [texto, setTexto] = useState('');
//   const [variaveis, setVariaveis] = useState([
//     { id: '1', nome: 'Nome' },
//     { id: '2', nome: 'Serviço' },
//     { id: '3', nome: 'Data' },
//     { id: '4', nome: 'Hora' },
//     { id: '5', nome: 'Empresa' },
//   ]);
//   const [exibirSugestoes, setExibirSugestoes] = useState(false);

//   // Função para capturar a digitação do usuário e verificar o caractere "@"
//   function handleInputChange(input) {
//     setTexto(input);
//     if (input.includes('@')) {
//       setExibirSugestoes(true);
//     } else {
//       setExibirSugestoes(false);
//     }
//   }

//   // Função para inserir a variável no texto
//   function inserirVariavel(variavel) {
//     const novoTexto = texto.replace('@', '{' + variavel + '}'); // Substitui o @ pela variável selecionada
//     setTexto(novoTexto);
//     setExibirSugestoes(false); // Oculta as sugestões após a inserção
//   }

//   return (
//     <View style={{ padding: 20 }}>
//       <TextInput
//         value={texto}
//         onChangeText={handleInputChange}
//         placeholder="Digite sua mensagem"
//         style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 8 }}
//       />
      
//       {/* Exibe as sugestões de variáveis se o usuário digitar "@" */}
//       {exibirSugestoes && (
//         <FlatList
//           data={variaveis}
//           renderItem={({ item }) => (
//             <TouchableOpacity onPress={() => inserirVariavel(item.nome)}>
//               <Text style={{ padding: 10, backgroundColor: '#f0f0f0', marginBottom: 5 }}>
//                 {item.nome}
//               </Text>
//             </TouchableOpacity>
//           )}
//           keyExtractor={item => item.id}
//         />
//       )}
//     </View>
//   );
// }
