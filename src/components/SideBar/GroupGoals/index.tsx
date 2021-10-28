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
  const [renderThisGroup, setRenderThisGroup] = useState(
    goals.length == 0 ? 'dontrender' : 'initial'
  );

  if (renderThisGroup === 'initial' || renderThisGroup === 'haveSomething') {
    return (
      <Flex flexDirection="column" width="80%" borderRadius="4px" marginTop="1rem">
        <Text fontSize=".8rem" color="gray.400" fontWeight="semibold" marginBottom=".5rem">
          {description}
        </Text>
        {goals?.map((goal) => {
          if (filter !== '') {
            if (goal.description.includes(filter)) {
              if (renderThisGroup === 'initial') {
                setRenderThisGroup('haveSomething');
              }
              return (
                <Card
                  key={Math.random()}
                  goal={{ ...goal, category_description: description }}
                  closeMenu={closeMobile}
                />
              );
            } else {
              if (renderThisGroup === 'haveSomething') {
                return;
              } else {
                setRenderThisGroup('dontrender');
              }
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
  } else if (renderThisGroup === 'dontrender') {
    return <></>;
  }
}
