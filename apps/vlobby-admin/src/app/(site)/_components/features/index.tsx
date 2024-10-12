import React from 'react';
import { GradientContainer } from '../gradient-container';
import { Container } from '../container';
import { Heading } from '../heading';
import { Subheading } from '../subheading';
import { FeatureIconContainer } from './feature-icon-container';
import {
  Card,
  CardDescription,
  CardSkeletonContainer,
  CardTitle,
} from './card';
import { SkeletonOne } from './skeletons/first';
import { SkeletonTwo } from './skeletons/second';
import { SkeletonThree } from './skeletons/third';
import { SkeletonFour } from './skeletons/fourth';
import { SkeletonFive } from './skeletons/fifth';
import { FaBolt } from 'react-icons/fa6';
import { Badge } from '@tremor/react';

export const Features = () => {
  return (
    <GradientContainer className="md:my-20">
      <Container className="py-20 max-w-5xl mx-auto  relative z-40">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <FaBolt className="h-6 w-6 text-primary" />
        </FeatureIconContainer>
        <Heading className="pt-4">Streamline resident services</Heading>
        <Subheading className="text-muted-foreground">
          VLobby offers a comprehensive set of features to enhance your property
          management and improve the resident experience in multi use and BTR
          projects.
        </Subheading>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 py-10">
          <Card className="lg:col-span-2">
            <CardTitle>
              Streamlined control of hundreds of smart devices
            </CardTitle>
            <CardDescription>
              With our integrated platform, you can manage locks, thermostats,
              and schedule access for maintenance requests across multiple
              units, saving you time and effort.
            </CardDescription>
            <CardSkeletonContainer>
              <SkeletonOne />
            </CardSkeletonContainer>
          </Card>
          <Card>
            <CardSkeletonContainer className="max-w-[16rem] mx-auto">
              <SkeletonTwo />
            </CardSkeletonContainer>
            <CardTitle>Real-time Data Always</CardTitle>
            <CardDescription>
              Monitor occupancy rates, track maintenance requests, and gain
              insights into resident satisfaction in real-time.
            </CardDescription>
          </Card>
          <Card>
            <CardSkeletonContainer>
              <SkeletonThree />
            </CardSkeletonContainer>
            <CardTitle>Integrated Monitoring</CardTitle>
            <CardDescription>
              Industry leading monitoring tools to keep your property in top
              shape. EV charge management, temperature/moisture monitoring, and
              more.
            </CardDescription>
          </Card>

          <Card>
            <CardSkeletonContainer
              showGradient={false}
              className="max-w-[16rem] mx-auto"
            >
              <SkeletonFour />
            </CardSkeletonContainer>
            <CardTitle>Resident Social Features</CardTitle>
            <CardDescription>
              Foster a sense of community with our built-in social features.
              Residents can connect, organize events, and share important
              information through our user-friendly platform.
            </CardDescription>
          </Card>

          <Card>
            <CardSkeletonContainer>
              <SkeletonFive />
            </CardSkeletonContainer>
            <CardTitle>Managed Billing</CardTitle>
            <CardDescription className="flex items-start gap-2 flex-col">
              <Badge size="xs" color="orange">
                Coming Soon
              </Badge>
              Simplify your financial operations with our integrated billing system. Automate rent collection, manage utility payments, and generate comprehensive financial reports effortlessly.
            </CardDescription>
          </Card>
        </div>
      </Container>
    </GradientContainer>
  );
};
