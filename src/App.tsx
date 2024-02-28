import { useEffect, useState, useRef, FormEvent } from 'react';
import { FiTrash } from 'react-icons/fi';
import { api } from './services/api';

interface CustomersProps {
  name: string;
  address: string;
  city: string;
  date_of_birth: string; // Mudança aqui
  phone: string;
  email: string;
  created_at: string;
  status: boolean;
  id: string;
}

function Componente(props: CustomersProps) {
  return <div>{new Date(props.date_of_birth).toLocaleDateString()}</div>; // Formato da data alterado aqui
}


export default function App() {
  const [customers, setCustomers] = useState<CustomersProps[]>([]);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const addressRef = useRef<HTMLInputElement | null>(null);
  const cityRef = useRef<HTMLInputElement | null>(null);
  const date_of_birthRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    const response = await api.get("/customers");
    setCustomers(response.data);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (
      !nameRef.current?.value ||
      !addressRef.current?.value ||
      !cityRef.current?.value ||
      !date_of_birthRef.current?.value ||
      !phoneRef.current?.value ||
      !emailRef.current?.value
    )
      return;

    const dateOfBirthString = date_of_birthRef.current?.value;
    const formattedDateOfBirth = dateOfBirthString ? new Date(dateOfBirthString).toISOString() : null;


    const response = await api.post("/customer", {
      name: nameRef.current?.value,
      address: addressRef.current?.value,
      city: cityRef.current?.value,
      date_of_birth: formattedDateOfBirth,
      phone: phoneRef.current?.value,
      email: emailRef.current?.value,
    });

    setCustomers(allCustomers => [...allCustomers, response.data]);

    nameRef.current.value = "";
    addressRef.current.value = "";
    cityRef.current.value = "";
    date_of_birthRef.current.value = "";
    phoneRef.current.value = "";
    emailRef.current.value = "";
  }

  async function handleDelete(id: string) {
    try {
      await api.delete("/customer", {
        params: {
          id: id,
        },
      });

      const allCustomers = customers.filter(customer => customer.id !== id);
      setCustomers(allCustomers);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="W-full min-h-screen bg-slate-600 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text-4xl font-medium text-white">Aluno</h1>

        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
          <label className="font-medium text-white">Nome:</label>
          <input
            type="text"
            placeholder="Digite seu  nome completo"
            className="w-full mb-5 p-2 rounded"
            ref={nameRef}
          />

          <label className="font-medium text-white">Endereço:</label>
          <input
            type="text"
            placeholder="Digite seu endereço"
            className="w-full mb-5 p-2 rounded"
            ref={addressRef}
          />

          <label className="font-medium text-white">Cidade:</label>
          <input
            type="text"
            placeholder="Digite sua cidade"
            className="w-full mb-5 p-2 rounded"
            ref={cityRef}
          />

          <label className="font-medium text-white">Data de Nascimento:</label>
          <input
            type="date"
            placeholder="Digite sua data de nascimento"
            className="w-full mb-5 p-2 rounded"
            ref={date_of_birthRef}
          />

          <label className="font-medium text-white">Fone:</label>
          <input
            type="text"
            placeholder="Digite seu telefone"
            className="w-full mb-5 p-2 rounded"
            ref={phoneRef}
          />

          <label className="font-medium text-white">email:</label>
          <input
            type="text"
            placeholder="Digite seu email"
            className="w-full mb-5 p-2 rounded"
            ref={emailRef}
          />

          <input
            type="submit"
            value="Cadastrar"
            className="cursor-pointer w-full p-2 bg-sky-300 rounded font-medium"
          />
        </form>

        <section className="flex flex-col gap-4">
          {customers.map(customer => (
            <article
              key={customer.id}
              className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200"
            >
              <p>
                <span className="font-medium">Nome:</span>
                {customer.name}
              </p>
              <p>
                <span className="font-medium">Endereço:</span>
                {customer.address}
              </p>
              <p>
                <span className="font-medium">Cidade:</span>
                {customer.city}
              </p>
              <p>
                <span className="font-medium">Data de nascimento:</span>
                {customer.date_of_birth ? new Date(customer.date_of_birth)
                .toLocaleDateString() : 'Data inválida'}
                
              </p>
              <p>
                <span className="font-medium">Fone:</span>
                {customer.phone}
              </p>
              <p>
                <span className="font-medium">Email:</span>
                {customer.email}
              </p>
              <p>
                <span className="font-medium">Status:</span>
                {customer.status ? 'ATIVO' : 'INATIVO'}
              </p>

              <button
                className="bg-blue-600 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2"
                onClick={() => handleDelete(customer.id)}
              >
                <FiTrash size={18} color="#fff" />
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
