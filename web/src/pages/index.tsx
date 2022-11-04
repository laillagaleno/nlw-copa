import Image from 'next/image'
import logoImg from '../assets/logo.svg'
import avataresImg from '../assets/avatares.png'
import appPreviewImg from  '../assets/aplicacao-trilha-ignite.png'
import iconImg from '../assets/icon.svg'
import { api } from '../lib/axios';
import { FormEvent, useState } from 'react';

interface HomeProps{
  poolCount:number;
  guessCount:number;
  userCount:number;
}

export default function Home(props: HomeProps) {
  //estado é uma variavel q vai ser manipulado pelo componente, tendo acesso ao seu valor
  const [poolTitle, setPoolTitle] = useState('');

  async function createPooll(event: FormEvent){
    event.preventDefault()

    try{
      const response = await api.post('/pools', {
        title: poolTitle
      });

      const { code } = response.data
      await navigator.clipboard.writeText(code)

      alert("Bolão criado com sucesso, o codigo foi copiado para a area de transferencia!")
      setPoolTitle('');

    }catch (err){
      console.log(err)
      alert("Falha ao criar bolão")
    }
    
  }

  return (
  
      <div className=' gap-28 max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center'>
        <main>
         
          <Image src={logoImg} alt="Logo da Aplicação" />
          <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>Crie se próprio bolão da copa e compartilhe entre amigos!</h1>
          
          <div className='mt-10 flex items-center gap-2'>
            <Image src={avataresImg} alt="" />
            <strong className='text-gray-100 text-xl'>
              <span className='text-green-500'>+{props.userCount}</span> pessoas já estão usando
            </strong>
          </div>

          <form 
            onSubmit={createPooll} 
            className='mt-10 flex gap-2 '
            >
            <input 
              className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
              type="text" 
              placeholder="Qual nome do seu bolão?"
              value={poolTitle}
              onChange={event=> setPoolTitle(event.target.value)}
            />
            <button 
              type='submit'
              className='bg-yellow-500 px-6 py-4 rounded font-bold text-gray-900 text-sm uppercase hover:bg-yellow-600'
            >
                Criar meu bolão
            </button>
          </form>

          <p className='text-gray-300 mt-4 text-sm leading-relaxed'>Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas </p>
          
          <div className='mt-10 pt-10 border-t border-gray-600 items-center flex justify-between text-gray-100'>
            <div className='flex items-center gap-6'>
              <Image src={iconImg} alt=" "></Image>
              <div className=' flex flex-col'>
                <span className='font-bold text-2xl'>+{props.poolCount}</span>
                <span>Botões Criados</span>
              </div>
            </div>
            
            <div className='w-px h-14 bg-gray-600'></div>

            <div className='flex items-center gap-6'>
              <Image src={iconImg} alt=" "></Image>
              <div className=' flex flex-col'>
                <span className='font-bold text-2xl'>+{props.guessCount}</span>
                <span>Palpites enviados</span>
              </div>
            </div>

          </div>
        </main>
      
       <Image src={appPreviewImg} 
          alt="Dois celulares que demonstram a previa da aplicação no mobile" 
          quality={80}
       /> 
      </div>
   

  )
}




export const getStaticProps = async () => {

//executar em paralelo
  const [poolCountResponse, guessCountResponde, userCountResponse ] = await Promise.all([
    api.get('pools/count'),
    api.get('/guesses/count'),
    api.get('users/count'),

  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponde.data.count,
      userCount: userCountResponse.data.count,
    },
    revalidate: 60,
  }
}