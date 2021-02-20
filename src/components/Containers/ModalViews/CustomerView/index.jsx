import React, { useEffect, useCallback, useState } from 'react'

import api from '@services/api'

import { FiEdit, FiTrash2 } from 'react-icons/fi'
import { FlexRow, Subtitle, List, ListItem, ListItemBox, ListEmpty } from '@styles/components'
import Input from '@components/Input'
import Button from '@components/Button'

const CustomerView = ({ entityId: id, onClose, onEditClick, onRemoveClick }) => {
  const [customer, setCustomer] = useState(null)

  const loasCustomer = useCallback(async () => {
    if (id) {
      const res = await api.get(`customers/${id}?_embed=numberPlates`)
      setCustomer(res.data)
    }
  }, [id])

  useEffect(() => {
    loasCustomer()
  }, [loasCustomer, id])

  return (
    <div>
      <FlexRow justifyContent="flex-end">
        <Button variant="warning" onClick={onEditClick}>
          <FiEdit />
        </Button>

        <Button variant="error" onClick={onRemoveClick}>
          <FiTrash2 />
        </Button>
      </FlexRow>

      <Input
        name="name"
        label="Nome"
        defaultValue={customer?.name}
        readOnly
      />

      <Input
        name="phone1"
        label="Telefone 1"
        defaultValue={customer?.phone1}
        readOnly
      />

      <Input
        name="phone2"
        label="Telefone 2"
        defaultValue={customer?.phone2}
        readOnly
      />

      <br />

      <Subtitle>
        Placas
      </Subtitle>

      <List>
        {customer?.numberPlates.length ? customer?.numberPlates.map((item, index) => (
          <ListItem key={index}>
            <ListItemBox grow={1}>
              <p>Código: {item.code}</p>
              <p>Descrição: {item.description}</p>
            </ListItemBox>
          </ListItem>
        )) : (
            <ListEmpty>
              <i>Nenhuma placa foi adicionada a esse cliente.</i>
            </ListEmpty>
          )}
      </List>

      <br />

      <Button variant="error" onClick={onClose}>
        Fechar
      </Button>
    </div>
  )
}

export default CustomerView