import React, { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import Header from '../components/Header'
import Polling from '../components/Header/Polling'
import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'

import { useIsBetaUI } from '../hooks/useLocation'
import Swap from './Swap'
import { RedirectToSwap } from './Swap/redirects'
import Pool from './Pool'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity
} from './AddLiquidity/redirects'
import AddLiquidity from './AddLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import RemoveLiquidity from './RemoveLiquidity'
import PoolFinder from './PoolFinder'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div<{ isBeta: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top:  ${({ isBeta }) => (isBeta ? '0px' : '100px')}; 
  align-items: ${({ isBeta }) => (isBeta ? 'unset' : 'center')};
  // padding: ${({ isBeta }) => (isBeta ? '50px' : undefined)};
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;
  min-height: 100vh;

  ${({ theme, isBeta }) => theme.mediaWidth.upToSmall`
    padding: ${isBeta ? '0px' : '16px'};
    padding-top: ${isBeta ? '0px' : '2rem'}; 
  `};

  z-index: 1;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

export default function App() {
  const isBeta = useIsBetaUI()

  return (
    <Suspense fallback={null}>
      <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} />
      <AppWrapper>
        <URLWarning />
        {!isBeta && (
          <HeaderWrapper>
            <Header />
          </HeaderWrapper>
        )}

        <BodyWrapper isBeta={isBeta}>
          <Popups />
          <Polling />
          <Web3ReactManager>
            <Switch>
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
              <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact path="/create" component={AddLiquidity} />
              <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
              <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
              <Route exact strict path="/pool" component={Pool} />
              <Route exact strict path="/create" component={RedirectToAddLiquidity} />
              <Route exact strict path="/find" component={PoolFinder} />
              <Route exact strict path="/" component={Swap} />
              <Route exact strict path="/:outputCurrency" component={RedirectToSwap} />
            </Switch>
          </Web3ReactManager>
          {!isBeta && <Marginer />}
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  )
}
