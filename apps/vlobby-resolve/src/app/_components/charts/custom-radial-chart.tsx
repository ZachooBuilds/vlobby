'use client';

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@repo/ui/components/ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { colorsList } from '../../../lib/staticData';

export const description = 'A radial chart with stacked sections';

export interface RadialChartDataItem {
  label: string;
  value: number;
  key: string;
  color?: string;
}

interface RadialChartProps {
  data: RadialChartDataItem[];
  title: string;
  description?: string;
}

const getColorForIndex = (index: number) => {
  return colorsList[index % colorsList.length]?.hex ?? '#000000';
};

export function RadialChart({ data, title, description }: RadialChartProps) {
  const chartData = [
    {
      title: title,
      [data[0]?.key ?? '']: data[0]?.value ?? 0,
      [data[1]?.key ?? '']: data[1]?.value ?? 0,
    },
  ];

  console.log(chartData);

  const totalValue = data[1]?.value ?? 0;

  // Assign colors from the palette if not already set
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color ?? getColorForIndex(index),
  }));

  const chartConfig: ChartConfig = Object.fromEntries(
    data.map((item, index) => [
      item.key,
      { label: item.label, color: getColorForIndex(index) },
    ])
  );

  console.log(chartConfig);

  return (
    <Card className="flex flex-col w-full text-sm">
      <CardHeader className="items-start pb-0">
        <CardTitle className="text-md font-medium text-foreground">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalValue.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 4}
                          className="fill-muted-foreground"
                        >
                          {data[1]?.label}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            {dataWithColors.map((item, index) => (
              <RadialBar
                key={index}
                dataKey={item.key}
                stackId="a"
                cornerRadius={5}
                fill={item.color}
                className="stroke-transparent stroke-2"
              />
            ))}
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
