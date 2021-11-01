import { Flex, Text, Stack, Grid, Spinner, Icon } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';

type GroupGoalsProps = {
  description: string;
  goals: {
    ref: string;
    days: number;
    daysCompleted: number;
    description: string;
    end_date: string;
    start_date: string;
    report_type: string;
    category: string;
    reports: [];
  }[];
  filter: string;
  closeMobile?: (boolean?) => void;
};

export function GroupGoals({ description, goals, filter, closeMobile }: GroupGoalsProps) {
  if (!goals.find((goal) => goal.description.toUpperCase().includes(filter.toUpperCase()))) {
    return <></>;
  } else {
    return (
      <Flex flexDirection="column" width="80%" marginTop={['.5rem', '1rem']}>
        <Text
          fontSize={['.6rem', '.8rem']}
          color="gray.400"
          fontWeight="semibold"
          marginBottom=".5rem"
        >
          {description}
        </Text>
        {goals?.map((goal) => {
          if (filter !== '') {
            if (goal?.description?.toUpperCase().includes(filter.toUpperCase())) {
              return (
                <Card
                  key={Math.random()}
                  goal={{ ...goal, category_description: description }}
                  closeMenu={closeMobile}
                />
              );
            }
          } else {
            return (
              <Card
                key={Math.random()}
                goal={{ ...goal, category_description: description }}
                closeMenu={closeMobile}
              />
            );
          }
        })}
      </Flex>
    );
  }
}
