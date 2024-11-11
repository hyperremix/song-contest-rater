import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { color } from '../../constants/color';

type Props = SvgProps & {
  size?: number;
};

export const Logo = ({ size = 64, ...props }: Props) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 16.93333 16.933333"
    stroke={color.primary}
    fill="none"
    {...props}
  >
    <Path
      strokeWidth={1.22705}
      d="M 0.72517325,9.6782664 H 7.5306406 c 1.3945627,0 1.3945627,-2.0639525 0,-2.0639525 H 4.6299497 c -1.394625,0 -1.4225165,-2.0918447 -0.027892,-2.0918447 h 7.6979883 c 1.394562,0 1.394562,2.0918447 0,2.0918447 h -2.147627 l 4.908862,5.5782521 M 16.319807,8.4666657 A 7.8531403,7.8531409 0 0 1 8.4666668,16.319807 7.8531403,7.8531409 0 0 1 0.61352672,8.4666657 7.8531403,7.8531409 0 0 1 8.4666668,0.61352482 7.8531403,7.8531409 0 0 1 16.319807,8.4666657 Z"
    />
  </Svg>
);
