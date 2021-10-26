import { Flex, Text, Grid, Image, ScaleFade } from '@chakra-ui/react';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { theme } from '../../styles/theme';
import { Button } from '../Button';
import { EditIcon } from '@chakra-ui/icons';
import { useContext } from 'react';
import { GoalsContext } from '../../contexts/GoalsContext';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface DashboardProps {
  onOpen: () => void;
}

export function DashBoard({ onOpen }: DashboardProps) {
  const { selectedGoal } = useContext(GoalsContext);
  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'radialBar',
      foreColor: theme.colors.pink[500],
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 15,
          size: '85%',
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: '2rem',
            fontFamily: 'Sora',
            fontWeight: 600,
            color: theme.colors.pink[500],
          },
          value: {
            show: true,
            fontSize: '1rem',
            color: theme.colors.pink[600],
            fontWeight: 700,
          },
        },
      },
    },
    stroke: {
      lineCap: 'round',
    },
    labels: [`Meta: ${selectedGoal?.days || 0} dias`],
    fill: {
      colors: theme.colors.pink[500],
      opacity: 0.1,
      type: 'gradient',
      gradient: {
        shade: 'dark',
        opacityFrom: 1,
        opacityTo: 0.8,
      },
    },
  };

  const series = [Math.floor((100 * selectedGoal?.daysCompleted) / selectedGoal?.days) || 0];

  return (
    <Flex flexDirection="column" height="100%" alignItems="center" justify="center" width="100%">
      {selectedGoal?.days === undefined ? (
        <>
          <Image src="/select.png" alt="Selecione uma meta" />
          <Text marginTop="2rem" fontSize="1.5rem" fontWeight="500" color="gray.400">
            Selecione ao lado uma meta
          </Text>
        </>
      ) : (
        <ScaleFade initialScale={0.9} in={selectedGoal?.days && true}>
          <Chart options={options} series={series} type="radialBar" height="400" width="400" />
          <Flex
            height="2.5rem"
            style={{ border: '1px solid #C4244D', borderRadius: '8px' }}
            alignItems="center"
            justifyContent="center"
            marginTop="2rem"
            marginBottom="1rem"
          >
            <Flex alignItems="center" onClick={onOpen} cursor="pointer" padding="1rem">
              <Text>{selectedGoal?.description}</Text>
              <EditIcon marginLeft="1rem" />
            </Flex>
          </Flex>
          <Grid marginTop="2rem" gridTemplateColumns="1fr 1fr" gap="2">
            <Button description="Concluido" color={theme.colors.green[500]} />
            <Button description="Hoje não deu..." color={theme.colors.gray[500]} />
          </Grid>{' '}
        </ScaleFade>
      )}
    </Flex>
  );
}
