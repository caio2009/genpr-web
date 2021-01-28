import React from 'react'

import { Wrapper, Centralizer, DialogWrapper, Header, Content, Actions } from './styles'
import { Title, FlexRow, ActionButton } from '../../styles/components'


const ConfirmDialog = ({ show, title, message, onConfirm, onCancel }) => {
  return (
    <Wrapper show={show}>
      <Centralizer>
        <DialogWrapper>
          {title &&
            <Header>
              <Title size={1.25} marginBottom={0}>
                {title}
              </Title>
            </Header>}

          <Content>
            {message}
          </Content>

          <Actions>
            <FlexRow gap={1}>
              <ActionButton color="purple" onClick={onConfirm}>
                Confirmar
              </ActionButton>
              <ActionButton color="red" transparent onClick={onCancel}>
                Cancelar
              </ActionButton>
            </FlexRow>
          </Actions>
        </DialogWrapper>
      </Centralizer>
    </Wrapper>
  )
}

export default ConfirmDialog