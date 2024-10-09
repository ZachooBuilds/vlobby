'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';
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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { colorsList } from '../../../lib/staticData';

export interface PieChartData {
  key: string;
  value: number;
  label: string;
}

interface PieChartProps {
  data: PieChartData[];
  title: string;
  description?: string;
  totalLabel?: string;
  trendPercentage?: number;
  trendDescription?: string;
}

const getColorForIndex = (index: number) => {
  return colorsList[index % colorsList.length]?.hex ?? '#000000';
};

export function CustomPieChart({
  data,
  title,
  description,
  totalLabel = 'Total',
  trendPercentage,
  trendDescription,
}: PieChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: getColorForIndex(index),
  }));

  const chartConfig: ChartConfig = Object.fromEntries(
    data.map((item, index) => [
      item.key,
      { label: item.label, color: getColorForIndex(index) },
    ])
  );

  const total = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col w-full">
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
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] p-0"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="key"
              innerRadius={70}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      {(trendPercentage !== undefined || trendDescription) && (
        <CardFooter className="flex-col gap-2 text-sm">
          {trendPercentage !== undefined && (
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending {trendPercentage >= 0 ? 'up' : 'down'} by{' '}
              {Math.abs(trendPercentage)}% this month{' '}
              <TrendingUp
                className={`h-4 w-4 ${trendPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}
              />
            </div>
          )}
          {trendDescription && (
            <div className="leading-none text-muted-foreground">
              {trendDescription}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
