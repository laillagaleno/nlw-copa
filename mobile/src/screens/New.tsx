import { Heading, VStack, Text }  from 'native-base'
import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { Input } from '../components/Input'
import Logo from '../assets/logo.svg'

export default function New(){
    return(
        <VStack flex={1} bgColor="gray.900">
            <Header title="Criar novo bolão"/>

            <VStack mt={8} mx={5} alignItems="center">

                <Logo width={212} height={40} /> 
                <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
                    Crie seu próprio bolão da copa e compartilhe entre amigos!
                </Heading>

                <Input mb={2} placeholder='Qual nome do seu bolão?'/>

                <Button title="Criar meu bolão"/>

                <Text color="gray.200" my={4} px={2} fontSize="sm" textAlign="center">
                    Após criar seu bolão, você receberá um {'\n'} código único que poderá usar para convidar {'\n'} outras pessoas.
                </Text>

            </VStack>
           


        </VStack>
    )
}