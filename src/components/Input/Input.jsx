export default function Input ({ setInput, placeholder, value, type }){
  const inputId = `input-${placeholder}`;
  return (
    <div className="pt-2 w-full relative">
      <input
        value={value}
        onChange={(e) => setInput(placeholder === 'price' ? e.target.value : e.target.value)}
        type={type || (placeholder === 'price' ? 'number' : 'text')}
        id={inputId}
        placeholder=" "
        className="w-full border-2 border-black rounded-md p-3 pt-4 pb-2 focus:outline-none peer"
      />
      <label
        htmlFor={inputId}
        className="absolute pl-1 pr-1 left-2.5 top-0 bg-white text-sm peer-focus:top-0 peer-focus:text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-5"
      >
        {placeholder}
      </label>
    </div>
  );
};