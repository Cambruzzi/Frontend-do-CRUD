/**
 * Componente genérico para campos de entrada de texto/número.
 * Padroniza o visual e o comportamento dos inputs no sistema inteiro.
 */
export function InputPadrao({ 
  name, 
  type = 'text',
  placeholder, 
  step, 
  value, 
  onChange, 
  disabled, 
  required = true 
}) {
  return (
    <div className="input-container">
      <input
        name={name}
        type={type}
        step={step}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        style={{ width: '100%', padding: '10px', borderRadius: '4px' }} 
      />
    </div>
  );
}