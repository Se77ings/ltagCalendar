import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView, Alert, Image, Modal, Pressable, Button, InteractionManager } from "react-native";
import SectionedMultiSelect from "react-native-sectioned-multi-select";

import Ionicons from "@expo/vector-icons/Ionicons";

const DropdownSelector = ({ lista, label, icone, callbackSelecionados, selectedItems = null, opt, servicoSelecionado = null }) => {
	const [itensSelecionados, setItensSelecionados] = useState([]);
	const [dadosFormatados, setDadosFormatados] = useState([]);

	useEffect(() => {
		if (opt == "servico") {
			const favoritos = lista.filter((item) => item.Favorito === 1 && item.Desabilitado === 0);
			const outros = lista.filter((item) => item.Favorito === 0 && item.Desabilitado === 0);

			const dadosAgrupados = [
				{
					name: "Favoritos",
					id: "list0",
					children: favoritos.map(({ Nome, id }) => ({
						name: Nome,
						id,
					})),
				},
				{
					name: "Outros",
					id: "list1",
					children: outros.map(({ Nome, id }) => ({
						name: Nome,
						id,
					})),
				},
			];
			setDadosFormatados(dadosAgrupados);
		} else if (opt == "colaborador") {
			let dadosAgrupados = [];
			console.log("Validando se: ", servicoSelecionado, "é igual a [], resultado ->", servicoSelecionado == []);
			if (servicoSelecionado.length == 0) {
				const colaboradorIds = new Set();

				dadosAgrupados = [
					{
						name: "Todos os Colaboradores",
						id: "list0",
						children: lista
							.filter(({ ColaboradorId }) => {
								if (!colaboradorIds.has(ColaboradorId)) {
									colaboradorIds.add(ColaboradorId);
									return true;
								}
								return false;
							})
							.map(({ Nome, id }) => ({
								name: Nome,
								id,
							})),
					},
				];
			} else {
				const afinidadeIds = new Set();

				// Lista de colaboradores com afinidade
				const colaboradoresComAfinidade = lista
					.filter((item) => {
						const temAfinidade = servicoSelecionado.some((servico) => servico.id === item.ServicoId);
						if (temAfinidade && !afinidadeIds.has(item.ColaboradorId)) {
							afinidadeIds.add(item.ColaboradorId);
							return true;
						}
						return false;
					})
					.map(({ Nome, id }) => ({
						name: Nome,
						id,
					}));

				// Lista de outros colaboradores, excluindo os que já estão na lista de afinidade
				const outrosColaboradores = lista
					.filter((item) => !afinidadeIds.has(item.ColaboradorId))
					.map(({ Nome, id }) => ({
						name: Nome,
						id,
					}));

				// Estruturando o array final
				dadosAgrupados = [
					{
						name: "Colaboradores com Afinidade",
						id: "list1",
						children: colaboradoresComAfinidade,
					},
					{
						name: "Outros Colaboradores",
						id: "list2",
						children: outrosColaboradores,
					},
				];
			}
			console.log(dadosAgrupados[0].children);

			setDadosFormatados(dadosAgrupados);
		} else if (opt === "ramo") {
			const dadosAgrupados = lista.map((item, index) => {
				const children = item.servicos
					.filter((servico) => servico.desabilitado === 0) // Inclui apenas serviços habilitados
					.map((servico, servicoIndex) => ({
						id: `servico_${item.id}_${servicoIndex}`,
						name: servico.nome,
					}));

				return {
					id: `list_${item.id}`,
					name: item.nome,
					children, // Agora `children` contém um único array de todos os serviços habilitados
				};
			});

			setDadosFormatados(dadosAgrupados);

			// Logs para verificação
			console.log(dadosAgrupados);
			console.log(dadosAgrupados[0]?.children); // Exibe todos os serviços do primeiro item em um único array
		}
	}, [lista]);

	useEffect(() => {
		if (callbackSelecionados) callbackSelecionados(itensSelecionados);
    else console.log(itensSelecionados)
	}, [itensSelecionados]);

	useEffect(() => {
		if (selectedItems && selectedItems.length > 0) {
			const idsSelecionados = selectedItems.map((item) => item.id);
			setItensSelecionados(idsSelecionados);
		}
	}, []);

	const handleSelectedItemsChange = (selectedItems) => {
		setItensSelecionados(selectedItems);
	};

	const ref = useRef(null);

	return (
		<SectionedMultiSelect
			hideSearch={true}
			ref={ref}
			items={dadosFormatados}
			uniqueKey="id"
			confirmText="Selecionar"
			subKey={"children"}
			displayKey={"name"}
			selectText={label}
			showDropDowns={opt != "ramo" ? false : true}
			readOnlyHeadings={opt != "ramo" ? true : false}
			onSelectedItemsChange={handleSelectedItemsChange}
			selectedItems={itensSelecionados}
			IconRenderer={Ionicons}
			headerComponent={() => (
				<View style={{ padding: 10, flexDirection: "row", justifyContent: "space-between" }}>
					<Text style={{ fontSize: 18, paddingLeft: 10, paddingTop: 10 }}>Selecione Abaixo:</Text>
					<Ionicons
						onPress={() => {
							console.log(this.current);
							ref && ref.current && ref.current._closeSelector();
						}}
						name="close"
						size={30}
						color="#312fbf"
					/>
				</View>
			)}
			selectToggleIconComponent={
				<Ionicons
					name="arrow-down"
					size={20}
					color="#312fbf"
				/>
			}
			dropDownToggleIconDownComponent={
				<Ionicons
					name="arrow-down"
					size={20}
					color="#312fbf"
				/>
			}
			dropDownToggleIconUpComponent={
				<Ionicons
					name="arrow-up"
					size={20}
					color="#312fbf"
				/>
			}
			selectedIconComponent={
				<Ionicons
					name="checkmark"
					size={20}
					color="#312fbf"
				/>
			}
			renderSelectText={() => {
				return (
					<View style={{ flex: 1, flexDirection: "row" }}>
						<Ionicons
							name={icone}
							size={20}
							color="#312fbf"
						/>
						{itensSelecionados.length === 0 ? (
							<Text style={{ color: "#312fbf", fontSize: 16, marginLeft: 5 }}>Selecione {label}</Text>
						) : (
							<Text style={{ color: "#312fbf", fontSize: 16, marginLeft: 5 }}>
								{itensSelecionados.length} {label} selecionado(s)
							</Text>
						)}
					</View>
				);
			}}
			styles={{
				selectToggle: {
					backgroundColor: "#F3F4F6",
					borderColor: "#312fbf",
					padding: 10,
					borderRadius: 5,
					marginTop: 5,
					marginBottom: 10,
					justifyContent: "space-between",
				},
				selectToggleText: {
					color: "#312fbf",
					fontSize: 16,
					fontWeight: "500",
				},
				item: {
					backgroundColor: "#FFFFFF",
					paddingVertical: 10,
					paddingHorizontal: 15,
					borderBottomWidth: 1,
					borderColor: "#f0f0f0",
					marginVertical: 3,
				},
				selectedItem: {
					backgroundColor: "#e6eaff",
				},
				chipContainer: {
					backgroundColor: "#312fbf",
					borderWidth: 0,
				},
				chipText: {
					color: "#FFFFFF",
				},
				button: {
					backgroundColor: "#312fbf",
					padding: 10,
					borderRadius: 5,
				},
				confirmText: {
					color: "#FFFFFF",
				},
				subItem: {
					marginVertical: 3,
				},
			}}
			colors={{
				primary: "#312fbf",
				success: "#4caf50",
				cancel: "#1A1A1A",
				text: "#2e2e2e",
				selectToggleTextColor: "#312fbf",
				itemBackground: "#fff",
				subItemBackground: "#ffffff",
			}}
		/>
	);
};

export default DropdownSelector;
