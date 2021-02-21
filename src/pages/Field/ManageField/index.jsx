import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useToast } from '@hooks/Toast/toast'
import { useConfirmDialog } from '@hooks/confirmDialog'
import { useOptionDialog } from '@hooks/optionDialog'
import { useModal } from '@hooks/modal'
import { useSelectDialog } from '@hooks/selectDialog'

import api from '@services/api'
import { format, getYear, getMonth } from 'date-fns'
import months from '@global/months'

import { FiMoreVertical } from 'react-icons/fi'
import { Container, Title, FlexRow, List, ListEmpty, ListItem, ListItemBox, IconButton, Subtitle } from '@styles/components'
import { FieldInfo, InfoField, YearMonthContainer } from './styles'
import Button from '@components/Button'
import Accordion from '@components/Accordion'
import EditFieldForm from '@components/Forms/EditFieldForm'
import CreateHarvestForm from '@components/Forms/CreateHarvestForm'
import EditHarvestForm from '@components/Forms/EditHarvestForm'
import HarvestView from '@components/Containers/ModalViews/HarvestView'

const ManageRP = () => {
  const { id } = useParams()
  const { addToast } = useToast()
  const { openConfirmDialog } = useConfirmDialog()
  const { openOptionDialog } = useOptionDialog()
  const { openModal, closeModal } = useModal()
  const { openSelectDialog } = useSelectDialog()

  const today = new Date()

  const [field, setField] = useState(null)
  const [harvests, setHarvests] = useState([])
  const [infoDisplay, setInfoDisplay] = useState(false)
  const [selectedYear, setSelectedYear] = useState(() => getYear(today))
  const [selectedMonth, setSelectedMonth] = useState(() => getMonth(today))

  const loadField = useCallback(async () => {
    const res = await api.get(`fields/${id}?_expand=ruralProperty&_expand=cultivation`)
    setField({
      ...res.data,
      cultivation: {
        id: res.data.cultivation.id,
        name: `${res.data.cultivation.name} ${res.data.cultivation.variety}`
      }
    })
  }, [id])

  const loadHarvests = useCallback(async () => {
    const res = await api.get(`fields/${id}/harvests?_expand=classification&_expand=unitMeasure`)
    setHarvests(res.data)
  }, [id])

  useEffect(() => {
    loadField()
    loadHarvests()
  }, [loadField, loadHarvests])

  const openModalEditField = () => {
    openModal({
      title: 'Editar Talhão',
      content: (
        <EditFieldForm
          entityId={id}
          onEdited={handleFieldEdited}
          onCancel={closeModal}
        />
      )
    })
  }

  const openModalCreateHarvest = () => {
    openModal({
      title: 'Nova Colheita',
      content: (
        <CreateHarvestForm
          ruralProperty={{ id: field?.ruralProperty.id, name: field?.ruralProperty.name || '' }}
          field={{ id: field?.id, name: field?.name || '' }}
          cultivation={{ id: field?.cultivation.id, name: field?.cultivation.name }}
          onCreated={handleHarvestCreated}
          onCancel={closeModal}
        />
      )
    })
  }

  const openModalViewHarvest = (id) => {
    openModal({
      title: 'Colheita',
      content: (
        <HarvestView
          entityId={id}
          onClose={closeModal}
          onEditClick={() => openModalEditHarvest(id)}
          onRemoveClick={() => handleRemoveHarvest(id)}
        />
      )
    })
  }

  const openModalEditHarvest = (id) => {
    openModal({
      title: 'Editar Colheita',
      content: (
        <EditHarvestForm
          entityId={id}
          onEdited={handleHarvestEdited}
          onCancel={closeModal}
        />
      )
    })
  }

  const handleFieldEdited = () => {
    closeModal()
    addToast({ title: 'Sucesso', description: 'Talhão editado com sucesso!' })
    loadField()
  }

  const handleRemoveHarvest = (id) => {
    openConfirmDialog({
      title: 'Confirmação de Remoção',
      message: 'Realmente tem certeza de realizar essa operação de remoção?'
    }).then(async res => {
      if (res) {
        await api.delete(`harvests/${id}`)

        closeModal()
        addToast({ title: 'Sucesso', description: 'Remoção realizada com sucesso!' })
        loadHarvests()
      }
    })
  }

  const handleHarvestCreated = () => {
    closeModal()
    addToast({ title: 'Sucesso', description: 'Colheita criada com sucesso!' })
    loadHarvests()
  }

  const handleHarvestEdited = () => {
    closeModal()
    addToast({ title: 'Sucesso', description: 'Colheita editada com sucesso!' })
    loadHarvests()
  }

  const handleOpenOptionDialog = (e, id) => {
    e.stopPropagation()

    openOptionDialog([
      { label: 'Editar', action: () => openModalEditHarvest(id) },
      { label: 'Remover', action: () => handleRemoveHarvest(id) }
    ])
  }

  const years = useMemo(() => {
    return [...new Set(harvests.map(x => getYear(new Date(x.registerDate))))].map(year => ({ value: year, label: year }))
  }, [harvests])

  const formatMonth = (value) => {
    return value < 10 ? `0${value}` : value
  }

  const filteredHarvests = useMemo(() => {
    const mappedHarvests = new Map()

    const dates = new Set(harvests.map(x => {
      const date = new Date(x.registerDate)
      return new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
    }))

    dates.forEach(date => {
      mappedHarvests.set(format(date, 'dd/MM/yyyy'), harvests.filter(x => format(new Date(x.registerDate), 'dd/MM/yyyy') === format(date, 'dd/MM/yyyy')))
    })

    const filteredHarvests = Array.from(mappedHarvests).filter(x => x[0].split('/').slice(1).join('/') === `${formatMonth(selectedMonth + 1)}/${selectedYear}`)

    return filteredHarvests.map(x => ({ date: x[0], harvests: x[1] }))
  }, [harvests, selectedYear, selectedMonth])

  const openSelectYear = () => {
    openSelectDialog({
      title: 'Selecione um ano',
      options: years
    }).then(value => {
      setSelectedYear(value)
    })
  }

  const openSelectMonth = () => [
    openSelectDialog({
      title: 'Selecione um mês',
      options: months.map((month, index) => ({ value: index, label: month }))
    }).then(value => {
      setSelectedMonth(value)
    })
  ]

  return (
    <Container page>
      <Title>
        Gerenciar Talhão
      </Title>

      <Subtitle>
        Informações do Talhão
      </Subtitle>

      <FieldInfo>
        <div style={{ display: infoDisplay ? 'block' : 'none', marginBottom: '.25rem' }}>
          <FlexRow>
            <InfoField style={{ flex: 1 }}>
              <h4>Nome</h4>
              <p className="no-break-line">{field?.name}</p>
            </InfoField>

            <InfoField style={{ flex: 1 }}>
              <h4>Área</h4>
              {field?.area ?
                <p>{field.area} ha</p> :
                <p><i>Não informado</i></p>}
            </InfoField>
          </FlexRow>

          <FlexRow>
            <InfoField style={{ flex: 1 }}>
              <h4>Cultura</h4>
              <p>{field?.cultivation.name} {field?.cultivation.variety}</p>
            </InfoField>

            <InfoField style={{ flex: 1 }}>
              <h4>Data de abertura</h4>
              <p>{field?.openingDate && format(new Date(field.openingDate), 'dd/MM/yyyy')}</p>
            </InfoField>
          </FlexRow>

          <InfoField>
            <h4>Propriedade Rural</h4>
            <p>{field?.ruralProperty.name}</p>
          </InfoField>

          <Button variant="warning" full onClick={openModalEditField}>
            Editar Informações
          </Button>
        </div>

        <Button full onClick={() => setInfoDisplay(!infoDisplay)}>
          {infoDisplay ? 'Esconder' : 'Mostrar'}
        </Button>
      </FieldInfo>

      <FlexRow>
        <Title marginBottom={0} style={{ flex: 1 }}>
          Colheitas
        </Title>

        <Button onClick={openModalCreateHarvest}>
          Criar
        </Button>
      </FlexRow>

      <br />

      <YearMonthContainer>
        <div onClick={openSelectYear}>
          <p style={{ fontWeight: 'bold' }}>Ano</p>
          <p style={{ color: '#555' }}>{selectedYear}</p>
        </div>

        <div onClick={openSelectMonth}>
          <p style={{ fontWeight: 'bold' }}>Mês</p>
          <p style={{ color: '#555' }}>{months[selectedMonth]}</p>
        </div>
      </YearMonthContainer>

      <br />

      {filteredHarvests.length ? filteredHarvests.map((item, index) => (
        <Accordion
          key={index}
          title={item.date}
          content={(
            <List>
              {
                item.harvests.map((item, index) => (
                  <ListItem
                    hoverable
                    key={index}
                    onClick={() => openModalViewHarvest(item.id)}
                  >
                    <ListItemBox grow={1}>
                      <Subtitle>{item.classification.name}</Subtitle>
                      <p>Quantidade: {item.quantity} {item.unitMeasure.abbreviation}</p>
                    </ListItemBox>

                    <ListItemBox>
                      <IconButton onClick={(e) => handleOpenOptionDialog(e, item.id)}>
                        <FiMoreVertical size={24} />
                      </IconButton>
                    </ListItemBox>
                  </ListItem>
                ))
              }
            </List>
          )}
        />
      )) : (
        <ListEmpty>
          <i>Não há colheitas cadastradas.</i>
        </ListEmpty>
      )}
    </Container>
  )
}

export default ManageRP