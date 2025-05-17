
import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { File } from 'lucide-react';

// Define your PDF styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  invoiceInfo: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoColumn: {
    flexDirection: 'column',
    width: '48%',
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 3,
  },
  boldText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#CCCCCC',
    minHeight: 30,
    alignItems: 'center',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#F0F0F0',
    minHeight: 30,
    alignItems: 'center',
  },
  tableCol: {
    width: '40%',
    padding: 5,
  },
  tableColSmall: {
    width: '20%',
    padding: 5,
  },
  totals: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
    marginBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666',
  },
});

// Define the invoice data type
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  clientPhone: string;
  items: InvoiceItem[];
  taxRate: number;
  notes: string;
}

// Create the PDF Document component
const InvoicePDF = ({ data }: { data: InvoiceData }) => {
  // Calculate totals
  const calculateSubtotal = () => {
    return data.items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (data.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.text}>#{data.invoiceNumber}</Text>
        </View>

        {/* Invoice Info */}
        <View style={styles.invoiceInfo}>
          <View style={styles.infoColumn}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>From:</Text>
              <Text style={styles.boldText}>{data.companyName}</Text>
              <Text style={styles.text}>{data.companyAddress}</Text>
              <Text style={styles.text}>{data.companyEmail}</Text>
              <Text style={styles.text}>{data.companyPhone}</Text>
            </View>
          </View>
          <View style={styles.infoColumn}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bill To:</Text>
              <Text style={styles.boldText}>{data.clientName}</Text>
              <Text style={styles.text}>{data.clientAddress}</Text>
              <Text style={styles.text}>{data.clientEmail}</Text>
              <Text style={styles.text}>{data.clientPhone}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Invoice Details:</Text>
              <Text style={styles.text}>Date: {data.invoiceDate}</Text>
              <Text style={styles.text}>Due Date: {data.dueDate}</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <View style={styles.tableCol}>
              <Text style={styles.boldText}>Description</Text>
            </View>
            <View style={styles.tableColSmall}>
              <Text style={styles.boldText}>Quantity</Text>
            </View>
            <View style={styles.tableColSmall}>
              <Text style={styles.boldText}>Price</Text>
            </View>
            <View style={styles.tableColSmall}>
              <Text style={styles.boldText}>Amount</Text>
            </View>
          </View>

          {data.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.text}>{item.description}</Text>
              </View>
              <View style={styles.tableColSmall}>
                <Text style={styles.text}>{item.quantity}</Text>
              </View>
              <View style={styles.tableColSmall}>
                <Text style={styles.text}>${item.price.toFixed(2)}</Text>
              </View>
              <View style={styles.tableColSmall}>
                <Text style={styles.text}>${(item.quantity * item.price).toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.text}>Subtotal:</Text>
            <Text style={styles.text}>${calculateSubtotal().toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.text}>Tax ({data.taxRate}%):</Text>
            <Text style={styles.text}>${calculateTax().toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.boldText}>Total:</Text>
            <Text style={styles.boldText}>${calculateTotal().toFixed(2)}</Text>
          </View>
        </View>

        {/* Notes */}
        {data.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes:</Text>
            <Text style={styles.text}>{data.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by BillFlow - {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
};

// The button component to trigger download
export const DownloadInvoiceButton = ({ invoiceData }: { invoiceData: InvoiceData }) => {
  const filename = `invoice-${invoiceData.invoiceNumber}.pdf`;
  
  return (
    <PDFDownloadLink
      document={<InvoicePDF data={invoiceData} />}
      fileName={filename}
      className="inline-block"
    >
      {({ loading }) => (
        <Button 
          className="bg-billflow-600 hover:bg-billflow-700 flex items-center"
          disabled={loading}
        >
          <File className="mr-2 h-4 w-4" />
          {loading ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
};
