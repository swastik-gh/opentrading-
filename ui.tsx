import { defineComponent } from 'vue';

// A "Stat Card" for displaying prices or thresholds
export const StatCard = defineComponent({
  props: {
    label: { required: true },
    value: { required: true },
    color: { default: '#2c3e50' },
    subValue: { default: '' },
    subColor: { default: '#64748b' }
  },
  setup(props: { label: string; value: string | number; color: string; subValue: string; subColor: string }) {
    return () => (
      <div style={{
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: '#1e293b',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        minWidth: '180px',
        borderLeft: `4px solid ${props.color}`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e: MouseEvent) => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
      onMouseLeave={(e: MouseEvent) => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
      >
        <div style="font-size: 0.75rem; color: '#94a3b8'; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">{props.label}</div>
        <div style={{ fontSize: '1.75rem', fontWeight: '700', color: props.color, lineHeight: 1.2 }}>
          {props.value}
        </div>
        {props.subValue ? (
          <div style={{ fontSize: '0.875rem', color: props.subColor, marginTop: '6px', fontWeight: 500 }}>
            {props.subValue}
          </div>
        ) : null}
      </div>
    );
  }
});

// A styled button widget
export const AppButton = defineComponent({
  props: {
    onClick: { default: null }
  },
  setup(props: { onClick: (() => void) | null }, { slots }) {
    return () => (
      <button 
        onClick={props.onClick}
        style={{
          padding: '8px 16px',
          backgroundColor: '#42b883',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        {slots.default?.()}
      </button>
    );
  }
});