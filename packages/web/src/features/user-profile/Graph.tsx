import React, { useEffect, useMemo, useState } from 'react';
import {
  FlexibleWidthXYPlot,
  Hint,
  HintProps,
  HorizontalGridLines,
  LineMarkSeries,
  LineMarkSeriesPoint,
  LineSeriesPoint,
  VerticalGridLines,
  XAxis,
  YAxis,
} from 'react-vis';
import { AwardComposite, getManyAwards } from '../../components/AwardList/util';

interface Props {
  userId: string;
}

const Graph = ({ userId }: Props) => {
  const [data, setData] = useState<AwardComposite[]>([]);
  const [value, setValue] = useState<LineMarkSeriesPoint>();

  const fetchData = async () => {
    const response = await getManyAwards({ page: 1, size: 50 });
    if (response) {
      const { data, pagination } = response;
      setData(
        data
          .filter((x) => x.awardedTo.id === userId)
          .sort((a, b) => {
            if (a.award.createdAt! > b.award.createdAt!) return 1;
            else return -1;
          })
      );
    }
  };

  useEffect(() => {
    (async () => fetchData())();
  }, []);

  const processedData = useMemo((): LineSeriesPoint[] => {
    return data.map((d, i) => {
      const thisSum = data.reduce((sum, award, index) => {
        if (index <= i) {
          return (sum += award.achievement.achievementPoints);
        } else return sum;
      }, 0);

      return {
        x: new Date(d.award.createdAt!).getTime(),
        y: thisSum,
      };
    });
  }, [data, userId]);

  return (
    <FlexibleWidthXYPlot height={300} xType="time" className="w-full" onMouseLeave={() => setValue(undefined)}>
      <HorizontalGridLines />
      <VerticalGridLines />
      <LineMarkSeries data={processedData} onNearestXY={(value) => setValue(value)} />
      {value && <CustomHint value={value} />}
      <XAxis title="Date" />
      <YAxis title="Points" />
    </FlexibleWidthXYPlot>
  );
};

const CustomHint = ({ value, ...rest }: HintProps) => {
  const v = value as LineMarkSeriesPoint;

  return (
    <Hint value={v} {...rest}>
      <div className="bg-black rounded p-1 opacity-90">
        <div>{new Date(v.x).toISOString()}</div>
        <div>{v.y} points</div>
      </div>
    </Hint>
  );
};

export default Graph;
