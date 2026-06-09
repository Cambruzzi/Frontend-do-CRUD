import { InputPadrao } from './InputPadrao';

/**
 * Construtor dinâmico de formulários.
 * Ele recebe um array de configurações e renderiza automaticamente 
 * todos os inputs necessários na tela.
 */
export function RenderizadorCampos({ campos, valores, onChange, disabled }) {
  return (
    <>
      {campos.map((campo) => (
        <InputPadrao
          key={campo.name}
          name={campo.name}
          type={campo.type}
          step={campo.step}
          placeholder={campo.placeholder}
          // Pega o valor exato deste campo de dentro do objeto formData
          value={valores[campo.name]} 
          onChange={onChange}
          disabled={disabled}
        />
      ))}
    </>
  );
}