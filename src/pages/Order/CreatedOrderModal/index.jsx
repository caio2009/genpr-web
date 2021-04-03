import React, { useEffect, useCallback } from 'react'
import { useModal } from '@hooks/modal'
import { useToast } from '@hooks/Toast/toast'

import html2canvas from 'html2canvas'
import { format } from 'date-fns'
import currencyFormat from '@utils/currencyFormat'

import { Container, Receipt } from './styles'
import Button from '@components/Button'

const CreatedOrderModal = ({ order }) => {
  const { closeAllModals } = useModal()
  const { addToast } = useToast()

  const getBlobFromCanvas = (canvas) => {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        resolve(blob)
      }, 'image/jpeg')
    })
  }

  const createReceipt = useCallback(() => {
    if (order) {
      const receipt = document.querySelector('#receipt')

      receipt.innerHTML = `
        <tr>
          <td colspan="5"><hr /></td>
        </tr>
        <tr>
          <td colspan="5">Data: ${format(new Date(order.date), 'dd/MM/yyyy')}</td>
        </tr>
        <tr>
          <td colspan="5">Cliente: ${order.customer.name || order.customer}</td>
        </tr>
        <tr>
          <td colspan="5">Placa do veículo: ${order.licensePlate.code || order.licensePlate || 'Não informado'}</td>
        </tr>
        <tr>
          <td colspan="5">Local de entrega: ${order.deliveryPlace.description || order.deliveryPlace}</td>
        </tr>
        <tr>
          <td colspan="5"><hr /></td>
        </tr>
        <tr>
          <td>QTD.</td>
          <td>UN.</td>
          <td colspan="2">PRODUTO</td>
          <td>P. UNITÁRIO</td>
        </tr>
      `

      order.orderItems.forEach(orderItem => {
        receipt.innerHTML += `
          <tr>
            <td>${orderItem.quantity}</td>
            <td>${orderItem.unitMeasure.abbreviation}</td>
            <td>${orderItem.cultivation.fullname}</td>
            <td>${orderItem.classification.name}</td>
            <td>${currencyFormat(orderItem.unitPrice)}</td>
          </tr>
        `
      })

      receipt.innerHTML += `
        <tr>
          <td colspan="5"><hr /></td>
        </tr>
      `

      receipt.innerHTML += `
        <tr>
          <td colspan="5">TOTAL: ${currencyFormat(order.totalPrice)}</td>
        </tr>
      `
    }
  }, [order])

  useEffect(() => {
    createReceipt()
  }, [createReceipt])

  const share = async () => {
    const canvas = await html2canvas(document.querySelector('#receipt'))

    const blob = await getBlobFromCanvas(canvas)

    const img = new File([blob], 'recibo.jpeg', { type: 'image/jpeg' })

    const filesArray = [img]

    if (navigator.canShare && navigator.canShare({ files: filesArray })) {
      navigator.share({ text: 'Recibo', files: filesArray })
        .catch(e => {
          if (e.name === 'AbortError') return

          addToast({ type: 'error', title: 'Error', description: `${e}` })
        })
    } else {
      addToast({ type: 'error', title: 'Erro', description: `Your system doesn't support sharing files.` })
    }
  }

  return (
    <Container>
      <h3>Venda realizada com sucesso!</h3>

      <Receipt id="receipt" />

      <br />

      <Button variant="primary" full onClick={share}>Compartilhar</Button>
      <Button full onClick={closeAllModals}>Voltar</Button>
    </Container>
  )
}

export default CreatedOrderModal