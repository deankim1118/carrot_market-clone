interface FormInputProps {
  type: string;
  placeholder: string;
  required: boolean;
  errors: string[];
  name: string;
}

export default function FormInput({
  type,
  placeholder,
  required,
  errors,
  name,
}: FormInputProps) {
  return (
    <div className='flex flex-col gap-2 '>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className='bg-transparent rounded-md w-full h-10 focus:outline-none  placeholder:text-white/60 ring-1 focus:ring-4 transition border-none ring-neutral-200  focus:ring-orange-400'
        required={required}
      />
      {errors.map((error, index) => (
        <span key={index} className='text-red-500 font-medium'>
          {error}
        </span>
      ))}
    </div>
  );
}
