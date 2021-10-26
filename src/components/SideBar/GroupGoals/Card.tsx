import { Flex, Text, Grid } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { useContext } from 'react';
import { GoalsContext } from '../../../contexts/GoalsContext';

interface CardProps {
  goal: {
    ref: string;
    category_description: string;
    daysCompleted: number;
    days: number;
    description: string;
    end_date: string;
    start_date: string;
    report_type: string;
    category: string;
    reports: [];
  };
}

export function Card({ goal }: CardProps) {
  const { selectedGoal, handleGoalsData } = useContext(GoalsContext);

  const { days, description } = goal;

  return (
    <Grid
      templateColumns="20% 1fr 20%"
      alignItems="center"
      justifyItems="center"
      width="100%"
      height="4rem"
      bg={selectedGoal?.ref === goal?.ref ? 'pink.600' : 'gray.700'}
      borderRadius="4"
      marginBottom="1rem"
      gap="2"
      onClick={() => {
        handleGoalsData({ ...goal });
      }}
    >
      <Flex flexDirection="column" alignItems="center">
        <Text fontWeight="semibold">{days}</Text>
        <Text fontSize=".7rem">dias</Text>
      </Flex>
      <Flex width="100%">
        <Text fontSize="1rem">{description}</Text>
      </Flex>
      <Flex>
        <CheckIcon color="pink.500" />
      </Flex>
    </Grid>
  );
}
