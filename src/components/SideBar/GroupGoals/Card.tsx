import { Flex, Text, Grid, useBreakpointValue } from '@chakra-ui/react';
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
  closeMenu?: (boolean) => void;
}

export function Card({ goal, closeMenu }: CardProps) {
  const { selectedGoal, handleGoalsData } = useContext(GoalsContext);
  const isMobile = useBreakpointValue({ base: true, md: true, lg: true, xl: false });
  const { days, description } = goal;

  return (
    <Grid
      templateColumns="20% 1fr 20%"
      alignItems="center"
      justifyItems="center"
      width="100%"
      height={['3rem', '4rem']}
      bg={selectedGoal?.ref === goal?.ref ? 'pink.600' : 'gray.700'}
      borderRadius="4"
      marginBottom={['.5rem', '1rem']}
      gap="2"
      onClick={() => {
        handleGoalsData({ ...goal });
        if (isMobile) {
          closeMenu(false);
        }
      }}
      cursor="pointer"
    >
      <Flex flexDirection="column" alignItems="center">
        <Text
          fontWeight="semibold"
          fontSize={['.8rem', '1rem']}
          color={
            Math.floor((100 * goal?.daysCompleted - goal?.reports.length) / goal?.days) === 100 &&
            'gray.400'
          }
        >
          {days < 9999 ? days : days < 99999 ? Math.floor(days / 30) : Math.floor(days / 365)}
        </Text>
        <Text
          fontSize={['.5rem', '.7rem']}
          color={
            Math.floor((100 * goal?.daysCompleted - goal?.reports.length) / goal?.days) === 100 &&
            'gray.400'
          }
        >
          {days < 9999 ? 'dias' : days < 99999 ? 'meses' : 'anos'}
        </Text>
      </Flex>
      <Flex width="100%">
        <Text
          fontSize={['0.8rem', '.8rem']}
          textDecoration={
            Math.floor((100 * goal?.daysCompleted - goal?.reports.length) / goal?.days) === 100 &&
            'line-through'
          }
          color={
            Math.floor((100 * goal?.daysCompleted - goal?.reports.length) / goal?.days) === 100 &&
            'gray.400'
          }
        >
          {description.length > 20 ? `${description.slice(0, 20)}...` : description}
        </Text>
      </Flex>
      <Flex>
        {Math.floor((100 * goal?.daysCompleted - goal?.reports.length) / goal?.days) === 100 ? (
          '🎉'
        ) : (
          <CheckIcon color={selectedGoal?.ref === goal?.ref ? 'pink.900' : 'pink.600'} />
        )}
      </Flex>
    </Grid>
  );
}
