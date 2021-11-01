import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { useContext } from 'react';
import { GoalsContext } from '../../../contexts/GoalsContext';
import { theme } from '../../../styles/theme';
import { Text } from '@chakra-ui/react';
import { GoalsReport } from '../../../services/GoalsReport';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export function RadialBar() {
  const { selectedGoal } = useContext(GoalsContext);
  const { reports } = selectedGoal;
  const { daysCompleted, isCompleted } = GoalsReport();
  const options: ApexOptions = {
    chart: {
      width: '100%',
      height: 280,
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
            fontSize: '1.5rem',
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
    labels: [`Meta: ${selectedGoal?.days} dias`],
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

  const series = [Math.floor((100 * daysCompleted) / selectedGoal?.days) || 0];

  return (
    <>
      <Chart options={options} series={series} type="radialBar" width="350" height="350" />
      {!isCompleted && (
        <Text color="gray.400" fontSize={['.8rem', '1rem']}>
          Hey, você já completou{' '}
          <Text as="strong" color="pink.600">
            {daysCompleted}
          </Text>{' '}
          de{' '}
          <Text as="strong" color="pink.600">
            {' '}
            {selectedGoal?.days} dias
          </Text>{' '}
          da sua meta
        </Text>
      )}
    </>
  );
}
