import React from 'react'
import { useHistory } from 'react-router-dom'

import { Container, Title } from '@styles/components'
import { OptionsContainer, OptionCard } from './styles'

import incomeSvg from '../../assets/images/income.svg'
import stockSvg from '../../assets/images/stock.svg'
import fieldSvg from '../../assets/images/field.svg'
import boxSvg from '../../assets/images/box.svg'

const Home = () => {
  const history = useHistory()

  const options = [
    { title: 'Realizar Venda', img: incomeSvg, to: '/' },
    { title: 'Ver Estoque', img: stockSvg, to: '/estoque' },
    { title: 'Gerenciar PR', img: fieldSvg, to: '/propriedades-rurais/gerenciar/escolher' },
    { title: 'Cadastrar Produção', img: boxSvg, to: '/producoes/propriedades-rurais/escolher' }
  ]

  const handleClick = (to) => {
    history.push(to)
  }

  return (
    <Container page>
      <Title>Início</Title>

      <OptionsContainer>
        {options.map((option, index) => (
          <OptionCard key={index} onClick={() => handleClick(option.to)}>
            <img src={option.img} alt={option.title} />

            <Title marginBottom={0} centered>
              {option.title}
            </Title>
          </OptionCard>
        ))}
      </OptionsContainer>
    </Container>
  )
}

export default Home;