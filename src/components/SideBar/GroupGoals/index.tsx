import { Flex, Text, Stack, Grid, Spinner, Icon } from '@chakra-ui/react';
import { Card } from './Card';

type GroupGoalsProps = {
  description: string;
  goals: {
    days: number;
    daysCompleted: number;
    description: string;
    end_date: string;
    start_date: string;
    report_type: string;
    category: string;
    reports: [];
  }[];
};

export function GroupGoals({ description, goals }: GroupGoalsProps) {
  return (
    <Flex flexDirection="column" width="80%" borderRadius="4px" marginTop="1rem">
      <Text fontSize=".8rem" color="gray.400" fontWeight="semibold" marginBottom=".5rem">
        {description}
      </Text>
      {goals?.map((goal) => (
        <Card key={Math.random()} goal={{ ...goal, category_description: description }} />
      ))}
    </Flex>
  );
}
