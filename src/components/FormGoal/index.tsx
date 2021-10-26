import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  Text,
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../Button';
import { Input } from '../Form/Input';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useContext } from 'react';
import { GoalsContext } from '../../contexts/GoalsContext';

interface FormGoalProps {
  isOpen: boolean;
  handleClose: () => void;
  initialData?: {
    description: string;
    category: string;
    days: string;
  };
}

type CreateGoalData = {
  description: string;
  category: string;
  quantity: string;
};

const createGoalSchema = yup.object().shape({
  ref: yup.string(),
  description: yup.string().required('Descrição obrigatória'),
  category: yup.string().required('Informe uma categoria'),
  quantity: yup.number().required('Informe os dias'),
});

export function FormGoal({ isOpen, handleClose, initialData }: FormGoalProps) {
  const { selectedGoal } = useContext(GoalsContext);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm({
    resolver: yupResolver(createGoalSchema),
  });

  const handleCreateGoal: SubmitHandler<CreateGoalData> = async (values) => {
    return new Promise<void>(async (resolve) => {
      resolve();
      await fetch('http://localhost:3000/api/create', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      handleClose();
      reset();
    });
  };

  function handleResetForm() {
    handleClose();
    reset();
  }
  return (
    <Modal isOpen={isOpen} onClose={handleResetForm}>
      <ModalOverlay />
      <ModalContent bg="gray.800">
        <ModalHeader fontWeight="bold" align="center" color="pink.500" fontSize="1.5rem">
          {selectedGoal?.description ? 'Editar meta' : 'Cadastrar nova meta'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            as="form"
            flexDirection="column"
            marginBottom="1rem"
            onSubmit={handleSubmit(handleCreateGoal)}
          >
            {selectedGoal?.ref !== undefined && (
              <Input
                name="ref"
                type="hidden"
                value={selectedGoal?.ref}
                register={register}
                error={errors.ref}
              />
            )}
            <Input
              name="description"
              label="Nome da meta"
              placeholder="Estudar matemática..."
              value={selectedGoal?.description}
              register={register}
              error={errors.description}
            />
            <Input
              name="category"
              label="Categoria"
              placeholder="Esportes, saúde, estudos..."
              value={selectedGoal?.category_description}
              register={register}
              error={errors.category}
            />
            <Text marginTop="1rem" fontWeight="500" color="gray.500">
              Em quantos dias você deseja concluir a meta?
            </Text>
            <Flex flexDirection="row" width="30%" marginBottom="2rem">
              <Input
                name="quantity"
                value={selectedGoal?.days}
                placeholder="Ex: 99"
                register={register}
                error={errors.quantity}
              />
            </Flex>
            <Button
              description="Salvar"
              color="pink.600"
              width="100%"
              type="submit"
              isLoading={isSubmitting}
            />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
