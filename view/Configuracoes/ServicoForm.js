// ServicoForm.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
  nome: Yup.string()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(50, 'O nome deve ter no máximo 50 caracteres')
    .required('Obrigatório'),
  descricao: Yup.string()
    .min(3, 'A descrição deve ter no mínimo 3 caracteres')
    .max(100, 'A descrição deve ter no máximo 100 caracteres')
    .required('Obrigatório'),
});

const ServicoForm = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{ nome: '', descricao: '' }}
      validationSchema={SignupSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        resetForm();
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nome do Serviço:</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleChange('nome')}
            onBlur={handleBlur('nome')}
            value={values.nome}
            placeholder="Insira o nome do serviço"
          />
          {errors.nome && touched.nome ? (
            <Text style={styles.error}>{errors.nome}</Text>
          ) : null}

          <Text style={styles.label}>Descrição:</Text>
          <TextInput
            style={styles.textArea}
            onChangeText={handleChange('descricao')}
            onBlur={handleBlur('descricao')}
            value={values.descricao}
            placeholder="Insira a descrição do serviço"
            multiline
            numberOfLines={4}
          />
          {errors.descricao && touched.descricao ? (
            <Text style={styles.error}>{errors.descricao}</Text>
          ) : null}
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    borderWidth: 2,
    borderColor: '#666699',
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#c2c2d6',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666699',
  },
  input: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 2,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  error: {
    padding: 0,
    marginBottom: 10,
    color: 'red',
  },
});

export default ServicoForm;