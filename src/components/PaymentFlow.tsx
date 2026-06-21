import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CreditCard, 
  Wallet, 
  Smartphone, 
  Building, 
  Check, 
  Lock, 
  AlertTriangle, 
  X, 
  Loader2 
} from 'lucide-react';
import type { Space, Reservation } from '../types';
import { QrCode } from './QrCode';

interface PaymentFlowProps {
  space: Space;
  deskId: string;
  duration: string;
  price: number;
  initialPaymentMethod: string; // 'wallet' | 'card' | 'upi' | 'net'
  onCancel: () => void;
  onSuccess: (reservation: Reservation) => void;
}

type Step = 'summary' | 'details' | 'upi-waiting' | 'processing' | 'success';

export const PaymentFlow: React.FC<PaymentFlowProps> = ({
  space,
  deskId,
  duration,
  price,
  initialPaymentMethod,
  onCancel,
  onSuccess
}) => {
  const [step, setStep] = useState<Step>('summary');
  const [paymentMethod, setPaymentMethod] = useState<string>(initialPaymentMethod);
  
  // Credit Card States
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardFlipped, setCardFlipped] = useState(false);
  
  // UPI States
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('gpay');
  const [upiId, setUpiId] = useState('');
  const [isUpiVerified, setIsUpiVerified] = useState(false);
  const [isUpiVerifying, setIsUpiVerifying] = useState(false);
  const [upiCountdown, setUpiCountdown] = useState(180); // 3 minutes countdown
  
  // Netbanking States
  const [selectedBank, setSelectedBank] = useState<string>('hdfc');
  const [showBankGateway, setShowBankGateway] = useState(false);
  const [bankUserId, setBankUserId] = useState('');
  const [bankPassword, setBankPassword] = useState('');
  const [isBankAuthorizing, setIsBankAuthorizing] = useState(false);

  // Wallet States
  const walletBalance = 420; // Default wallet balance ₹420
  const isWalletInsufficient = price > walletBalance;
  const walletDeficit = price - walletBalance;
  
  // Processing States
  const [processingPhase, setProcessingPhase] = useState(1);
  
  const isQuietSpace = space.category === 'Quiet Zone' || space.name.toLowerCase().includes('reading room') || (space.categories && space.categories.includes('Libraries'));
  
  // Ticket success reference
  const [ticketRefCode, setTicketRefCode] = useState('');
  const [ticketTime, setTicketTime] = useState('');

  // Generate codes on mount
  useEffect(() => {
    const randomCode = `ZYV-${Math.floor(1000 + Math.random() * 9000)}-F`;
    setTicketRefCode(randomCode);
    
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTicketTime(timeNow);
  }, []);

  // UPI Timer effect
  useEffect(() => {
    if (step !== 'upi-waiting') return;
    const interval = setInterval(() => {
      setUpiCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const trimmed = value.substring(0, 16);
    const matches = trimmed.match(/.{1,4}/g);
    const formatted = matches ? matches.join(' ') : '';
    setCardNumber(formatted);
  };

  // Format Card Expiry (adds slash after 2 digits)
  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.substring(0, 4);
    
    if (value.length > 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExpiry(value);
    }
  };

  // Format Card Holder (capital letters only)
  const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardHolder(e.target.value.toUpperCase());
  };

  // Verify UPI ID simulation
  const handleVerifyUpi = () => {
    if (!upiId.includes('@')) return;
    setIsUpiVerifying(true);
    setTimeout(() => {
      setIsUpiVerifying(false);
      setIsUpiVerified(true);
    }, 1000);
  };

  // Simulate secure processing phases
  const startSecureProcessing = () => {
    setStep('processing');
    setProcessingPhase(1);
    
    // Phase 2 after 1.2s
    setTimeout(() => {
      setProcessingPhase(2);
    }, 1200);

    // Phase 3 after 2.4s
    setTimeout(() => {
      setProcessingPhase(3);
    }, 2400);

    // Done and show Success after 3.6s
    setTimeout(() => {
      setStep('success');
    }, 3600);
  };

  // Handle final checkout confirmation
  const handleProceedPayment = () => {
    if (step === 'summary') {
      setStep('details');
      return;
    }

    if (paymentMethod === 'card') {
      // Basic validation check
      if (cardNumber.length < 19 || cardHolder.trim() === '' || cardExpiry.length < 5 || cardCvv.length < 3) {
        return; // Fields incomplete
      }
      startSecureProcessing();
    } else if (paymentMethod === 'upi') {
      // Proceed to mock waiting drawer
      setStep('upi-waiting');
      // Auto-resolve app confirmation after 4s
      setTimeout(() => {
        startSecureProcessing();
      }, 4000);
    } else if (paymentMethod === 'net') {
      // Show login portal
      setShowBankGateway(true);
    } else if (paymentMethod === 'wallet') {
      startSecureProcessing();
    }
  };

  // Handle Netbanking authorization
  const handleBankAuthorize = () => {
    if (bankUserId.trim() === '' || bankPassword.trim() === '') return;
    setIsBankAuthorizing(true);
    setTimeout(() => {
      setIsBankAuthorizing(false);
      setShowBankGateway(false);
      startSecureProcessing();
    }, 1500);
  };

  // Close and create reservation
  const handleCompleteFlow = () => {
    const reservation: Reservation = {
      id: Math.random().toString(36).substring(2, 9),
      spaceName: space.name,
      spaceId: space.id,
      deskId,
      duration,
      price,
      time: ticketTime,
      ticketCode: ticketRefCode
    };
    onSuccess(reservation);
  };

  // Price breaking math
  const baseFare = Math.round(price * 0.95);
  const platformFee = 15;
  const studentDiscount = baseFare + platformFee - price;

  // Format UPI timer display
  const formatUpiTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Detect card network brand logo/text
  const getCardBrand = () => {
    if (cardNumber.startsWith('4')) return 'VISA';
    if (cardNumber.startsWith('5')) return 'MASTERCARD';
    return 'CARD';
  };

  // Button disabled conditions
  const isCtaDisabled = () => {
    if (step === 'summary') return false;
    
    if (paymentMethod === 'card') {
      return cardNumber.length < 19 || cardHolder.trim() === '' || cardExpiry.length < 5 || cardCvv.length < 3;
    }
    if (paymentMethod === 'upi') {
      return !isUpiVerified && upiId.trim() === '';
    }
    if (paymentMethod === 'net') {
      return false; // Grid items are always selected
    }
    return false;
  };

  return (
    <div className={`payment-flow-view ${isQuietSpace ? 'reading-room-theme' : ''}`} id="payment-flow-funnel">
      {/* Header */}
      {step !== 'processing' && step !== 'success' && (
        <div className="payment-flow-header">
          <button 
            type="button" 
            className="payment-back-btn" 
            onClick={() => {
              if (step === 'details') setStep('summary');
              else onCancel();
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h2>
            {step === 'summary' ? 'Order Checkout' : 'Secure Payment'}
          </h2>
          <button type="button" className="payment-close-btn" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>
      )}

      {/* Main Scroll Content */}
      {step !== 'processing' && step !== 'success' && (
        <div className="payment-scroll-content">
          {/* Progress Indicators */}
          <div className="filter-scroll-row" style={{ margin: '0', padding: '0' }}>
            <div style={{ display: 'flex', gap: '8px', fontSize: '10px', fontWeight: 800, color: 'var(--zyvo-text-muted)' }}>
              <span style={{ color: step === 'summary' ? 'var(--zyvo-orange)' : 'var(--zyvo-green)' }}>
                1. SUMMARY
              </span>
              <span>➔</span>
              <span style={{ color: step === 'details' ? 'var(--zyvo-orange)' : '#64748B' }}>
                2. PAYMENT DETAILS
              </span>
              <span>➔</span>
              <span>3. SUCCESS TICKET</span>
            </div>
          </div>

          {step === 'summary' ? (
            /* ========================================================
               STEP 1: SUMMARY SCREEN
               ======================================================== */
            <>
              {/* Product Info Glassmorphic Card */}
              <div className="checkout-summary-card">
                <div className="checkout-space-row">
                  <img src={space.image} alt={space.name} className="checkout-space-img" />
                  <div className="checkout-space-details">
                    <span className="checkout-space-title">{space.name}</span>
                    <p className="checkout-space-meta">{space.locationText}</p>
                    {isQuietSpace && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <span className="verified-space-badge" style={{ background: '#0F766E', fontSize: '8px', padding: '3px 6px', color: '#FFF' }}>
                          📖 Silent Reading Room Pass
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="price-divider" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                  <div>
                    <span style={{ color: 'var(--zyvo-text-muted)', display: 'block', fontSize: '9px', fontWeight: 700 }}>
                      ASSIGNED SPOT
                    </span>
                    <strong style={{ color: 'var(--zyvo-text-main)' }}>{deskId}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--zyvo-text-muted)', display: 'block', fontSize: '9px', fontWeight: 700 }}>
                      DURATION
                    </span>
                    <strong style={{ color: 'var(--zyvo-text-main)' }}>{duration}</strong>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="price-breakdown-box">
                <div className="price-item-row">
                  <span>Base Focus Fare</span>
                  <span>₹{baseFare}</span>
                </div>
                <div className="price-item-row">
                  <span>Platform Secure Fee</span>
                  <span>₹{platformFee}</span>
                </div>
                {studentDiscount > 0 && (
                  <div className="price-item-row discount-row">
                    <span>Zyvo Student Coupon</span>
                    <span>-₹{studentDiscount}</span>
                  </div>
                )}
                <div className="price-divider" />
                <div className="price-total-row">
                  <span>Total Bill Amount</span>
                  <span>₹{price}</span>
                </div>
              </div>

              {/* Payment Method Selector Trigger */}
              <div style={{ marginTop: '4px' }}>
                <span className="payment-section-label" style={{ fontSize: '10px', color: 'var(--zyvo-text-muted)', display: 'block', marginBottom: '8px', fontWeight: 800 }}>
                  CHOSEN PAYMENT OPTION
                </span>
                
                <div className="method-card-list">
                  <div 
                    className={`method-option-card ${paymentMethod === 'wallet' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('wallet')}
                  >
                    <div className="method-option-left">
                      <div className="payment-method-icon-wrap">
                        <Wallet size={16} />
                      </div>
                      <div>
                        <span className="method-option-title">Zyvo Balance Wallet</span>
                        <p className="method-option-desc">Current Credits: ₹{walletBalance}</p>
                      </div>
                    </div>
                    <div className="method-radio-outer">
                      <div className="method-radio-inner" />
                    </div>
                  </div>

                  <div 
                    className={`method-option-card ${paymentMethod === 'card' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className="method-option-left">
                      <div className="payment-method-icon-wrap">
                        <CreditCard size={16} />
                      </div>
                      <div>
                        <span className="method-option-title">Credit or Debit Card</span>
                        <p className="method-option-desc">Visa, Mastercard, RuPay supported</p>
                      </div>
                    </div>
                    <div className="method-radio-outer">
                      <div className="method-radio-inner" />
                    </div>
                  </div>

                  <div 
                    className={`method-option-card ${paymentMethod === 'upi' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <div className="method-option-left">
                      <div className="payment-method-icon-wrap">
                        <Smartphone size={16} />
                      </div>
                      <div>
                        <span className="method-option-title">UPI Apps & ID</span>
                        <p className="method-option-desc">GPay, PhonePe, Paytm</p>
                      </div>
                    </div>
                    <div className="method-radio-outer">
                      <div className="method-radio-inner" />
                    </div>
                  </div>

                  <div 
                    className={`method-option-card ${paymentMethod === 'net' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('net')}
                  >
                    <div className="method-option-left">
                      <div className="payment-method-icon-wrap">
                        <Building size={16} />
                      </div>
                      <div>
                        <span className="method-option-title">Net Banking</span>
                        <p className="method-option-desc">Instant secure bank authorization</p>
                      </div>
                    </div>
                    <div className="method-radio-outer">
                      <div className="method-radio-inner" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* ========================================================
               STEP 2: PAYMENT METHOD-SPECIFIC INTERFACES
               ======================================================== */
            <>
              {/* Mini Price Row */}
              <div className="checkout-summary-card" style={{ padding: '10px 14px', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div className="payment-method-icon-wrap" style={{ width: '28px', height: '28px' }}>
                    {paymentMethod === 'card' && <CreditCard size={14} />}
                    {paymentMethod === 'wallet' && <Wallet size={14} />}
                    {paymentMethod === 'upi' && <Smartphone size={14} />}
                    {paymentMethod === 'net' && <Building size={14} />}
                  </div>
                  <strong style={{ fontSize: '12px' }}>
                    {paymentMethod === 'card' && 'Credit/Debit Card'}
                    {paymentMethod === 'wallet' && 'Zyvo Wallet'}
                    {paymentMethod === 'upi' && 'UPI System'}
                    {paymentMethod === 'net' && 'Netbanking'}
                  </strong>
                </div>
                <strong style={{ color: 'var(--zyvo-orange)', fontSize: '14px' }}>₹{price}</strong>
              </div>

              {/* CARD METHOD DETAILED VIEW */}
              {paymentMethod === 'card' && (
                <div>
                  {/* Digital Flipping Credit Card Simulation */}
                  <div className="credit-card-container">
                    <div className={`credit-card-inner ${cardFlipped ? 'flipped' : ''}`}>
                      {/* CARD FRONT */}
                      <div className="credit-card-front">
                        <div className="card-gloss-overlay" />
                        <div className="card-top-row">
                          <div className="card-chip" />
                          <div className="card-brand">
                            {getCardBrand() === 'MASTERCARD' ? (
                              <div className="card-brand-circles">
                                <div className="brand-circle brand-circle-red" />
                                <div className="brand-circle brand-circle-yellow" />
                              </div>
                            ) : (
                              getCardBrand()
                            )}
                          </div>
                        </div>
                        
                        <div className="card-mid-row">
                          <div className="card-number-display">
                            {cardNumber || '•••• •••• •••• ••••'}
                          </div>
                        </div>

                        <div className="card-bottom-row">
                          <div className="card-holder-info">
                            <span className="card-label">CARD HOLDER</span>
                            <span className="card-value">{cardHolder || 'YOUR NAME'}</span>
                          </div>
                          <div className="card-expiry-info">
                            <span className="card-label">EXPIRES</span>
                            <span className="card-value">{cardExpiry || 'MM/YY'}</span>
                          </div>
                        </div>
                      </div>

                      {/* CARD BACK */}
                      <div className="credit-card-back">
                        <div className="card-magnetic-strip" />
                        <div className="card-back-content">
                          <div className="card-cvv-strip-row">
                            <span className="card-label" style={{ color: '#E2E8F0', paddingRight: '4px' }}>CVV CODE</span>
                            <div className="card-cvv-sig-strip">
                              <span className="card-cvv-value-display">{cardCvv || '•••'}</span>
                            </div>
                          </div>
                          <p className="card-back-disclaimer">
                            This simulated premium card remains secured under the ZYVO protocol. Authorized transactions are processed through encrypted channels.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Form Fields */}
                  <div className="payment-form-group">
                    <label htmlFor="card-num-input">CARD NUMBER</label>
                    <input 
                      id="card-num-input"
                      type="text" 
                      className="payment-input"
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                    />
                  </div>

                  <div className="payment-form-group">
                    <label htmlFor="card-name-input">CARDHOLDER NAME</label>
                    <input 
                      id="card-name-input"
                      type="text" 
                      className="payment-input"
                      placeholder="JOHN DOE"
                      value={cardHolder}
                      onChange={handleCardHolderChange}
                    />
                  </div>

                  <div className="payment-form-row">
                    <div className="payment-form-group">
                      <label htmlFor="card-exp-input">EXPIRY DATE</label>
                      <input 
                        id="card-exp-input"
                        type="text" 
                        className="payment-input"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleCardExpiryChange}
                        maxLength={5}
                      />
                    </div>
                    <div className="payment-form-group">
                      <label htmlFor="card-cvv-input">CVV</label>
                      <input 
                        id="card-cvv-input"
                        type="text" 
                        className="payment-input"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        onFocus={() => setCardFlipped(true)}
                        onBlur={() => setCardFlipped(false)}
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI DETAILED VIEW */}
              {paymentMethod === 'upi' && (
                <div>
                  <span className="payment-section-label" style={{ fontSize: '10px', color: 'var(--zyvo-text-muted)', display: 'block', marginBottom: '8px', fontWeight: 800 }}>
                    POPULAR UPI APPS
                  </span>
                  <div className="upi-apps-row">
                    <button 
                      type="button" 
                      className={`upi-app-btn ${selectedUpiApp === 'gpay' ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedUpiApp('gpay');
                        setUpiId('student@okaxis');
                        setIsUpiVerified(true);
                      }}
                    >
                      <div className="upi-app-logo gpay">G</div>
                      <span className="upi-app-name">GPay</span>
                    </button>
                    <button 
                      type="button" 
                      className={`upi-app-btn ${selectedUpiApp === 'phonepe' ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedUpiApp('phonepe');
                        setUpiId('student@ybl');
                        setIsUpiVerified(true);
                      }}
                    >
                      <div className="upi-app-logo phonepe">P</div>
                      <span className="upi-app-name">PhonePe</span>
                    </button>
                    <button 
                      type="button" 
                      className={`upi-app-btn ${selectedUpiApp === 'paytm' ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedUpiApp('paytm');
                        setUpiId('student@paytm');
                        setIsUpiVerified(true);
                      }}
                    >
                      <div className="upi-app-logo paytm">P</div>
                      <span className="upi-app-name">Paytm</span>
                    </button>
                  </div>

                  <div className="upi-divider-text">OR ENTER CUSTOM UPI ID</div>

                  <div className="payment-form-group">
                    <label htmlFor="upi-id-input">UPI ID (VPA)</label>
                    <div className="upi-input-group">
                      <input 
                        id="upi-id-input"
                        type="text" 
                        className="payment-input"
                        placeholder="username@bank"
                        value={upiId}
                        onChange={(e) => {
                          setUpiId(e.target.value);
                          setIsUpiVerified(false);
                        }}
                      />
                      <button 
                        type="button" 
                        className="upi-verify-btn" 
                        disabled={isUpiVerifying || !upiId.includes('@')}
                        onClick={handleVerifyUpi}
                      >
                        {isUpiVerifying ? 'Verifying...' : isUpiVerified ? 'Verified' : 'Verify'}
                      </button>
                    </div>
                    {isUpiVerified && (
                      <span style={{ fontSize: '10px', color: 'var(--zyvo-green)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontWeight: 700 }}>
                        <Check size={10} strokeWidth={4} /> UPI ID verified and linked successfully.
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* NETBANKING DETAILED VIEW */}
              {paymentMethod === 'net' && (
                <div>
                  <span className="payment-section-label" style={{ fontSize: '10px', color: 'var(--zyvo-text-muted)', display: 'block', marginBottom: '8px', fontWeight: 800 }}>
                    SELECT PREFERRED BANK
                  </span>
                  
                  <div className="bank-grid">
                    <button 
                      type="button" 
                      className={`bank-grid-item ${selectedBank === 'hdfc' ? 'selected' : ''}`}
                      onClick={() => setSelectedBank('hdfc')}
                    >
                      <div className="bank-logo-icon hdfc">H</div>
                      <span className="bank-name">HDFC Bank</span>
                    </button>
                    <button 
                      type="button" 
                      className={`bank-grid-item ${selectedBank === 'sbi' ? 'selected' : ''}`}
                      onClick={() => setSelectedBank('sbi')}
                    >
                      <div className="bank-logo-icon sbi">S</div>
                      <span className="bank-name">State Bank</span>
                    </button>
                    <button 
                      type="button" 
                      className={`bank-grid-item ${selectedBank === 'icici' ? 'selected' : ''}`}
                      onClick={() => setSelectedBank('icici')}
                    >
                      <div className="bank-logo-icon icici">I</div>
                      <span className="bank-name">ICICI Bank</span>
                    </button>
                    <button 
                      type="button" 
                      className={`bank-grid-item ${selectedBank === 'axis' ? 'selected' : ''}`}
                      onClick={() => setSelectedBank('axis')}
                    >
                      <div className="bank-logo-icon axis">A</div>
                      <span className="bank-name">Axis Bank</span>
                    </button>
                  </div>
                </div>
              )}

              {/* WALLET DETAILED VIEW */}
              {paymentMethod === 'wallet' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Digital Wallet Card */}
                  <div className="wallet-card-info">
                    <div className="wallet-balance-row">
                      <div>
                        <span className="wallet-label">ZYVO WALLET BALANCE</span>
                        <div className="wallet-balance-val">₹{walletBalance}</div>
                      </div>
                      <div className="wallet-card-chip" />
                    </div>
                    <div className="wallet-illustration-circles" />
                  </div>

                  {/* Calculations breakdown */}
                  <div className="price-breakdown-box">
                    <div className="wallet-breakdown-details">
                      <div className="wallet-breakdown-row">
                        <span>Current Wallet Balance</span>
                        <span>₹{walletBalance}</span>
                      </div>
                      <div className="wallet-breakdown-row deduction">
                        <span>Desk Reservation Cost</span>
                        <span>-₹{price}</span>
                      </div>
                      <div className="wallet-breakdown-row remaining">
                        <span>Remaining Wallet Balance</span>
                        <span>₹{isWalletInsufficient ? 0 : walletBalance - price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Insufficient balance top-up prompt */}
                  {isWalletInsufficient && (
                    <div className="wallet-alert-banner">
                      <AlertTriangle size={16} />
                      <div style={{ flex: 1 }}>
                        <strong>Balance Insufficient</strong>
                        <p style={{ marginTop: '2px', fontSize: '9.5px', color: '#7F1D1D' }}>
                          You need ₹{walletDeficit} more to make this purchase. Zyvo can top up the deficit automatically to complete your booking.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* STEP 2.5: UPI WAITING GATEWAY SIMULATION */}
      {step === 'upi-waiting' && (
        <div className="payment-scroll-content" style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <div className="checkout-summary-card" style={{ width: '100%', margin: '0' }}>
            <div className="upi-waiting-container">
              <div className="upi-waiting-pulse">
                <div className="upi-pulse-ring" />
                <div className="upi-pulse-ring-inner" />
                <div className="upi-waiting-icon">
                  <Smartphone size={22} />
                </div>
              </div>
              <strong style={{ fontSize: '15px', color: 'var(--zyvo-text-main)' }}>
                Waiting for UPI Approval
              </strong>
              <p style={{ fontSize: '11px', color: 'var(--zyvo-text-muted)', marginTop: '8px', lineHeight: 1.5 }}>
                We sent a collect request of <strong>₹{price}</strong> to your UPI ID <strong>{upiId}</strong>. Open your UPI app and authorize the transaction.
              </p>
              <div className="upi-timer">
                {formatUpiTimer(upiCountdown)}
              </div>
            </div>
            <div className="price-divider" />
            <button 
              type="button" 
              className="payment-primary-cta-btn"
              style={{ background: 'transparent', border: '1px solid var(--zyvo-border)', color: 'var(--zyvo-text-muted)', height: '40px' }}
              onClick={() => setStep('details')}
            >
              Cancel collect request
            </button>
          </div>
        </div>
      )}

      {/* NETBANKING SECURE BANK LOGIN SIMULATION PORTAL OVERLAY */}
      {showBankGateway && (
        <div className="bank-gateway-overlay">
          <div className="bank-gateway-modal">
            <div className="bank-gateway-header">
              <h4>
                {selectedBank === 'hdfc' && 'HDFC Netbanking Secure Gateway'}
                {selectedBank === 'sbi' && 'SBI Netbanking Secure Gateway'}
                {selectedBank === 'icici' && 'ICICI Netbanking Secure Gateway'}
                {selectedBank === 'axis' && 'Axis Netbanking Secure Gateway'}
              </h4>
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', color: '#FFF', fontSize: '14px', cursor: 'pointer' }}
                onClick={() => setShowBankGateway(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="bank-gateway-body">
              <div className="gateway-banner">
                🔒 <strong>Encryption Enabled</strong>: This is a secure simulation gateway for authorized Zyvo transactions.
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700 }}>
                <span>Booking Amount:</span>
                <span style={{ color: 'var(--zyvo-orange)' }}>₹{price}</span>
              </div>

              <div className="payment-form-group">
                <label htmlFor="nb-uid">Customer User ID</label>
                <input 
                  id="nb-uid"
                  type="text" 
                  className="payment-input" 
                  placeholder="1234567" 
                  value={bankUserId}
                  onChange={(e) => setBankUserId(e.target.value)}
                />
              </div>

              <div className="payment-form-group">
                <label htmlFor="nb-pwd">IPIN Password</label>
                <input 
                  id="nb-pwd"
                  type="password" 
                  className="payment-input" 
                  placeholder="••••••••" 
                  value={bankPassword}
                  onChange={(e) => setBankPassword(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button 
                  type="button" 
                  className="payment-primary-cta-btn" 
                  style={{ background: 'none', border: '1.5px solid var(--zyvo-border)', color: 'var(--zyvo-text-muted)', flex: 1 }}
                  onClick={() => setShowBankGateway(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="payment-primary-cta-btn" 
                  style={{ flex: 1 }}
                  disabled={bankUserId.trim() === '' || bankPassword.trim() === '' || isBankAuthorizing}
                  onClick={handleBankAuthorize}
                >
                  {isBankAuthorizing ? (
                    <>
                      <Loader2 className="spinning" size={14} /> Authorizing...
                    </>
                  ) : (
                    'Login & Pay'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
         STEP 3: SECURE PROCESSING LOADER OVERLAY
         ======================================================== */}
      {step === 'processing' && (
        <div className="processing-overlay-container">
          <div className="processing-loader-wrapper">
            <div className="processing-ring" />
            <div className="processing-ring-active" />
            <Lock className="processing-shield-icon" size={32} />
          </div>

          <span className="processing-title">Securing Checkout</span>
          <p className="processing-subtitle">
            Do not refresh or go back. Your ticket is being securely processed.
          </p>

          <div className="processing-steps-list">
            <div className={`processing-step-row ${processingPhase >= 1 ? (processingPhase > 1 ? 'completed' : 'active') : ''}`}>
              <div className="step-indicator-dot" />
              <span>
                {processingPhase > 1 ? '✓ Connection Established' : 'Connecting to secure servers...'}
              </span>
            </div>
            
            <div className={`processing-step-row ${processingPhase >= 2 ? (processingPhase > 2 ? 'completed' : 'active') : ''}`}>
              <div className="step-indicator-dot" />
              <span>
                {processingPhase > 2 ? '✓ Payment Authorized' : processingPhase === 2 ? 'Authorizing transaction...' : 'Waiting for authorization...'}
              </span>
            </div>

            <div className={`processing-step-row ${processingPhase >= 3 ? 'active' : ''}`}>
              <div className="step-indicator-dot" />
              <span>
                {processingPhase >= 3 ? 'Generating digital passport...' : 'Waiting for passport codes...'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
         STEP 4: TICKET SUCCESS RECEIPT SCREEN
         ======================================================== */}
      {step === 'success' && (
        <div className="payment-scroll-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '36px 18px 40px 18px' }}>
          <div className="success-screen-container">
            {/* Animated Checkmark Wrapper */}
            <div className="checkmark-circle-wrapper">
              <Check size={32} strokeWidth={3} />
            </div>
            <div className="success-header-copy">
              <h3>Reservation Confirmed</h3>
              <p>Your workspace is reserved. See passport details below.</p>
            </div>

            {/* Gorgeous Booking Ticket Card */}
            <div className="digital-booking-ticket">
              <div className="ticket-header-block" style={isQuietSpace ? { background: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)' } : {}}>
                <span className="ticket-brand">{isQuietSpace ? 'SILENT STUDY PASS' : 'ZYVO FOCUS PASS'}</span>
                <span className="ticket-status-badge">{isQuietSpace ? 'SILENT SPOT' : 'Locked In'}</span>
              </div>

              <div className="ticket-details-upper">
                <div className="ticket-space-name">{space.name}</div>
                
                <div className="ticket-meta-grid">
                  <div className="ticket-meta-item">
                    <span className="ticket-meta-label">Assigned Spot</span>
                    <span className="ticket-meta-val">{deskId}</span>
                  </div>
                  <div className="ticket-meta-item">
                    <span className="ticket-meta-label">Duration</span>
                    <span className="ticket-meta-val">{duration}</span>
                  </div>
                  <div className="ticket-meta-item">
                    <span className="ticket-meta-label">Check-In Time</span>
                    <span className="ticket-meta-val">{ticketTime}</span>
                  </div>
                  <div className="ticket-meta-item">
                    <span className="ticket-meta-label">Rate Charged</span>
                    <span className="ticket-meta-val">₹{price} Total</span>
                  </div>
                </div>
              </div>

              <div className="ticket-perforation-line" />

              <div className="ticket-details-lower">
                {isQuietSpace && (
                  <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '6px 10px', width: '100%', fontSize: '9px', color: '#14532D', textAlign: 'left', lineHeight: 1.4, marginBottom: '6px' }}>
                    <strong>🤫 Silent Study Guidelines:</strong> Please maintain quiet, avoid voice calls, and check in with this pass code.
                  </div>
                )}
                {/* Real Dynamic Scannable QR Code */}
                <div className="ticket-qr-container" style={{ background: '#FFFFFF', padding: '8px' }}>
                  <QrCode 
                    value={ticketRefCode} 
                    size={90} 
                  />
                </div>
                <div className="ticket-ref-code">{ticketRefCode}</div>
              </div>
            </div>

            {/* Done button */}
            <button 
              type="button" 
              className="payment-primary-cta-btn"
              onClick={handleCompleteFlow}
              style={{ width: '100%', marginTop: '10px' }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Actions (Steps 1 & 2 only) */}
      {step !== 'processing' && step !== 'success' && step !== 'upi-waiting' && (
        <div className="payment-flow-footer-btn-container">
          <button 
            type="button" 
            className="payment-primary-cta-btn"
            disabled={isCtaDisabled()}
            onClick={handleProceedPayment}
          >
            <Lock size={14} />
            {step === 'summary' ? (
              'Proceed to Payment'
            ) : paymentMethod === 'wallet' && isWalletInsufficient ? (
              `Top Up ₹${walletDeficit} & Pay`
            ) : (
              `Securely Pay ₹${price}`
            )}
          </button>
        </div>
      )}
    </div>
  );
};
